import { supabase } from "../services/supabase";

/**
 * Buscar estatísticas principais do Cockpit
 */
export async function getDashboardStats(restaurantId) {
    if (!restaurantId) {
        throw new Error("Restaurant ID não informado");
    }

    const [
        categories,
        products,
        qrCode
    ] = await Promise.all([
        supabase
            .from("categories")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId),

        supabase
            .from("products")
            .select("id", { count: "exact", head: true })
            .eq("restaurant_id", restaurantId),

        supabase
            .from("qr_codes")
            .select(`
                id,
                ativo,
                acessos,
                link,
                created_at,
                updated_at
            `)
            .eq("restaurant_id", restaurantId)
            .eq("tipo", "menu")
            .maybeSingle()
    ]);

    if (categories.error) throw categories.error;
    if (products.error) throw products.error;
    if (qrCode.error) throw qrCode.error;

    return {
        categoriesCount: categories.count ?? 0,
        productsCount: products.count ?? 0,
        qrCode: qrCode.data ?? null
    };
}

/**
 * Buscar atividades recentes com todos os tipos de eventos
 */
export async function getRecentActivities(restaurantId) {
    if (!restaurantId) {
        throw new Error("Restaurant ID não informado");
    }

    const [
        categories,
        products,
        qrCodes,
        restaurant
    ] = await Promise.all([
        supabase
            .from("categories")
            .select(`
                id,
                name,
                created_at,
                updated_at
            `)
            .eq("restaurant_id", restaurantId)
            .order("updated_at", { ascending: false })
            .limit(10),

        supabase
            .from("products")
            .select(`
                id,
                name,
                created_at,
                updated_at
            `)
            .eq("restaurant_id", restaurantId)
            .order("updated_at", { ascending: false })
            .limit(10),

        supabase
            .from("qr_codes")
            .select(`
                id,
                created_at,
                updated_at,
                acessos
            `)
            .eq("restaurant_id", restaurantId)
            .eq("tipo", "menu")
            .limit(1),

        supabase
            .from("restaurants")
            .select(`updated_at`)
            .eq("id", restaurantId)
            .maybeSingle()
    ]);

    if (categories.error) throw categories.error;
    if (products.error) throw products.error;
    if (qrCodes.error) throw qrCodes.error;
    if (restaurant.error) throw restaurant.error;

    const activities = [];

    // Atividades de Categorias
    categories.data?.forEach(category => {
        const created = category.created_at === category.updated_at;
        activities.push({
            type: "category",
            text: created 
                ? `Criou a categoria "${category.name}"` 
                : `Atualizou a categoria "${category.name}"`,
            date: category.updated_at
        });
    });

    // Atividades de Produtos
    products.data?.forEach(product => {
        const created = product.created_at === product.updated_at;
        activities.push({
            type: "product",
            text: created 
                ? `Adicionou o produto "${product.name}"` 
                : `Atualizou o produto "${product.name}"`,
            date: product.updated_at
        });
    });

    // Atividades de QR Code
    qrCodes.data?.forEach(qr => {
        activities.push({
            type: "qr",
            text: `QR Code do menu gerado (${qr.acessos || 0} acessos)`,
            date: qr.updated_at || qr.created_at
        });
    });

    // Atividades do Restaurante
    if (restaurant.data) {
        activities.push({
            type: "restaurant",
            text: "Atualizou informações do restaurante",
            date: restaurant.data.updated_at
        });
    }

    // Atividades de exclusao via audit trail
    try {
        const { data: auditLogs, error: auditError } = await supabase
            .from("audit_logs")
            .select(`
                id,
                action,
                table_name,
                record_id,
                record_name,
                created_at
            `)
            .eq("restaurant_id", restaurantId)
            .order("created_at", { ascending: false })
            .limit(10);

        if (!auditError && auditLogs) {
            auditLogs.forEach(log => {
                let text = "";
                
                if (log.table_name === "products" && log.action === "DELETE") {
                    text = `Eliminou o produto "${log.record_name || log.record_id}"`;
                } else if (log.table_name === "categories" && log.action === "DELETE") {
                    text = `Eliminou a categoria "${log.record_name || log.record_id}"`;
                } else if (log.table_name === "products" && log.action === "UPDATE") {
                    text = `Atualizou o produto "${log.record_name || log.record_id}"`;
                } else if (log.table_name === "categories" && log.action === "UPDATE") {
                    text = `Atualizou a categoria "${log.record_name || log.record_id}"`;
                } else if (log.action === "INSERT") {
                    text = `Criou ${log.table_name === "products" ? "produto" : "categoria"} "${log.record_name || log.record_id}"`;
                }

                if (text) {
                    activities.push({
                        type: "audit",
                        text: text,
                        date: log.created_at
                    });
                }
            });
        }
    } catch (err) {
        // Continua sem audit logs
    }

    // Ordenar por data (mais recente primeiro) e limitar
    return activities
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 15);
}

/**
 * Registrar atividade no audit log
 */
export async function logActivity({
    restaurantId,
    action,
    tableName,
    recordId,
    recordName,
    oldData = null,
    newData = null
}) {
    try {
        const { error } = await supabase
            .from("audit_logs")
            .insert({
                restaurant_id: restaurantId,
                action: action,
                table_name: tableName,
                record_id: recordId,
                record_name: recordName,
                old_data: oldData,
                new_data: newData,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error("Error logging activity:", error);
        }
    } catch (err) {
        console.error("Error in logActivity:", err);
    }
}

/**
 * Realtime do Cockpit
 */
export function subscribeDashboardChanges(restaurantId, callback) {
    if (!restaurantId) return null;

    const channel = supabase
        .channel(`restaurant-dashboard-${restaurantId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "categories",
                filter: `restaurant_id=eq.${restaurantId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "products",
                filter: `restaurant_id=eq.${restaurantId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "qr_codes",
                filter: `restaurant_id=eq.${restaurantId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "restaurants",
                filter: `id=eq.${restaurantId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "audit_logs",
                filter: `restaurant_id=eq.${restaurantId}`
            },
            (payload) => {
                callback(payload);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}