import { supabase, TABLES } from "./supabase";
import { logActivity } from "./restaurantDashboardService";

export async function getProducts(restaurantId) {
    const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function createProduct(product) {
    const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .insert([{
            ...product,
            disponivel: product.disponivel !== undefined ? product.disponivel : true,
        }])
        .select()
        .single();

    if (error) throw error;

    await logActivity({
        restaurantId: product.restaurant_id,
        action: 'INSERT',
        tableName: 'products',
        recordId: data.id,
        recordName: data.name,
        newData: data
    });

    return data;
}

export async function updateProduct(id, product) {
    const { data: oldProduct } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("id", id)
        .single();

    const { data, error } = await supabase
        .from(TABLES.PRODUCTS)
        .update({
            ...product,
            disponivel: product.disponivel !== undefined ? product.disponivel : true,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    await logActivity({
        restaurantId: product.restaurant_id,
        action: 'UPDATE',
        tableName: 'products',
        recordId: data.id,
        recordName: data.name,
        oldData: oldProduct,
        newData: data
    });

    return data;
}

export async function deleteProduct(id) {
    const { data: product } = await supabase
        .from(TABLES.PRODUCTS)
        .select("*")
        .eq("id", id)
        .single();

    const { error } = await supabase
        .from(TABLES.PRODUCTS)
        .delete()
        .eq("id", id);

    if (error) throw error;

    if (product) {
        await logActivity({
            restaurantId: product.restaurant_id,
            action: 'DELETE',
            tableName: 'products',
            recordId: product.id,
            recordName: product.name,
            oldData: product
        });
    }

    return product;
}