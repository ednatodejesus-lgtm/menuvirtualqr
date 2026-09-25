import { useEffect, useState, useCallback, useRef } from "react";

import {
    Store,
    FolderOpen,
    Package,
    QrCode,
    Utensils,
    Eye,
    Clock,
    Plus,
    RefreshCw,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCcw,
    Building2
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

import {
    getDashboardStats,
    getRecentActivities,
    subscribeDashboardChanges,
    logActivity
} from "../services/restaurantDashboardService";

import { supabase } from "../services/supabase";

import AdminSidebar from "../components/admin/AdminSidebar";


import AdminCategories from "../components/admin/AdminCategories";
import AdminProducts from "../components/admin/AdminProducts";
import AdminPromotions from '../components/admin/AdminPromotions';
import AdminQRCode from "../components/admin/AdminQRCode";
import AdminSettings from "../components/admin/AdminSettings";
import Help from "../components/admin/Help";

import "../styles/admin.css";

export default function RestaurantAdminDashboard() {
    const { profile, logout } = useAuth();

    const [restaurant, setRestaurant] = useState(null);
    const [activePage, setActivePage] = useState("dashboard");

    const [stats, setStats] = useState({
        categoriesCount: 0,
        productsCount: 0,
        qrCode: null
    });

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const restaurantId = profile?.restaurant_id;
    const unsubscribeRef = useRef(null);

    // Carregar o restaurante
    const loadRestaurant = useCallback(async () => {
        if (!profile?.restaurant_id) return;

        try {
            const { data, error } = await supabase
                .from("restaurants")
                .select(`
                    id,
                    name,
                    business_type,
                    status,
                    logo_url
                `)
                .eq("id", profile.restaurant_id)
                .single();

            if (error) {
                console.error("Error loading restaurant:", error);
                return;
            }

            setRestaurant(data);
        } catch (err) {
            console.error("Error loading restaurant:", err);
        }
    }, [profile?.restaurant_id]);

    // Carregar o dashboard
    const loadDashboard = useCallback(async () => {
        if (!restaurantId) return;

        try {
            setRefreshing(true);

            const [dashboardStats, recentActivities] = await Promise.all([
                getDashboardStats(restaurantId),
                getRecentActivities(restaurantId)
            ]);

            setStats(dashboardStats);
            setActivities(recentActivities);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [restaurantId]);

    // Carregar dados iniciais
    useEffect(() => {
        const init = async () => {
            await loadRestaurant();
            await loadDashboard();
        };

        init();
    }, [loadRestaurant, loadDashboard]);

    // Configurar Realtime
    useEffect(() => {
        if (!restaurantId) return;

        const unsubscribe = subscribeDashboardChanges(restaurantId, async (payload) => {
            await loadDashboard();
            
            if (payload.eventType === 'DELETE') {
                const tableName = payload.table;
                const recordId = payload.old?.id || payload.old?.record_id;
                const recordName = payload.old?.name || payload.old?.record_name || recordId;
                
                await logActivity({
                    restaurantId: restaurantId,
                    action: 'DELETE',
                    tableName: tableName,
                    recordId: recordId,
                    recordName: recordName,
                    oldData: payload.old
                });
            }
        });

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [restaurantId, loadDashboard]);

    // Renderizar página ativa
   const renderPage = () => {
    switch (activePage) {
        case "categories":
            return <AdminCategories />;
        case "products":
            return <AdminProducts />;
        case "promotions":
            return <AdminPromotions />;
        case "qrcode":
            return <AdminQRCode />;
        case "settings":
            return <AdminSettings />;
        case "help":
            return <Help />;
        default:
            return renderDashboard();
    }
};

    // Renderizar Dashboard
    const renderDashboard = () => {
        // Mapear tipo de atividade para ícone
        // ============================================================
// 🔥 ÍCONE POR AÇÃO (ÚNICO E LIMPO)
// ============================================================
const getActivityIcon = (activity) => {
    let { action } = activity;   

    // 🎯 ÍCONES ÚNICOS POR AÇÃO
    const ACTION_ICONS = {
        INSERT: {
            icon: <Plus size={18} strokeWidth={2.5} />,
            color: '#22c55e',
            bg: 'rgba(34, 197, 94, 0.12)',
        },
        UPDATE: {
            icon: <RefreshCw size={18} strokeWidth={2.5} />,
            color: '#3b82f6',
            bg: 'rgba(59, 130, 246, 0.12)',
        },
        DELETE: {
            icon: <Trash2 size={18} strokeWidth={2.5} />,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.12)',
        },
    };

    // Fallback: se não houver action, tentar deduzir do texto
    if (!action) {
        if (activity.text?.startsWith('Criou') || activity.text?.startsWith('Adicionou')) {
            action = 'INSERT';
        } else if (activity.text?.startsWith('Eliminou')) {
            action = 'DELETE';
        } else {
            action = 'UPDATE';
        }
    }

    const config = ACTION_ICONS[action] || ACTION_ICONS.UPDATE;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: config.bg,
                color: config.color,
                flexShrink: 0,
                transition: 'all 0.2s',
            }}
        >
            {config.icon}
        </div>
    );
};
        return (
            <div className="restaurant-cockpit">
                {/* Cabecalho do Dashboard */}
                <section className="cockpit-welcome">
                    <div className="restaurant-title">
                        <Store size={32} />
                        <div>
                            <h1>{restaurant?.name || "Empresa"}</h1>
                            <p>
                                {restaurant?.business_type}
                                {" "}·{" "}
                                <span className="status-active">
                                    {restaurant?.status === "active" ? "Activo" : "Suspenso"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <p>
                        Bem-vindo de volta,{" "}
                        <strong>{profile?.full_name}</strong>.
                        Aqui está o resumo do seu restaurante.
                    </p>

                    {/* Indicador de atualizacao */}
                    {refreshing && (
                        <span style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <RefreshCw size={14} className="animate-spin" />
                            A actualizar...
                        </span>
                    )}
                </section>

                {/* Estatisticas */}
                <section className="cockpit-stats">
                    <div className="status-card">
                        <FolderOpen size={20} />
                        <div>
                            <span>Categorias</span>
                            <strong>{stats.categoriesCount}</strong>
                        </div>
                    </div>

                    <div className="status-card">
                        <Package size={20} />
                        <div>
                            <span>Produtos</span>
                            <strong>{stats.productsCount}</strong>
                        </div>
                    </div>

                    <div className="status-card">
                        <QrCode size={20} />
                        <div>
                            <span>QR Code</span>
                            <strong>
                                {stats.qrCode?.ativo ? "Activo" : "Inactivo"}
                            </strong>
                        </div>
                    </div>

                    <div className="status-card">
                        <Utensils size={20} />
                        <div>
                            <span>Menu</span>
                            <strong>
                                {stats.productsCount > 0 ? "Publicado" : "Vazio"}
                            </strong>
                        </div>
                    </div>

                    <div className="status-card">
                        <Eye size={20} />
                        <div>
                            <span>Acessos</span>
                            <strong>{stats.qrCode?.acessos || 0}</strong>
                        </div>
                    </div>
                </section>

                {/* Atividades Recentes */}
                <section className="activity-panel">
                    <div className="activity-header">
                        <h2><Clock size={20} />  Actividades recentes</h2>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            {activities.length} registos
                        </span>
                    </div>

                    {loading ? (
                        <p style={{ color: "#64748b" }}>A carregar actividades...</p>
                    ) : (
                        <div className="activity-list">
                            {activities.length === 0 ? (
                                <p style={{ color: "#94a3b8", textAlign: "center", padding: "1rem" }}>
                                    Nenhuma actividade registada.
                                </p>
                            ) : (
                                   activities.map((activity, index) => (
                                    <div
                                        className="activity-item"
                                        key={`${activity.type}-${activity.date}-${index}`}
                                        style={{
                                             display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                        }}
                                        >
                                        {/* 🔥 ÍCONE DA AÇÃO */}
                                        {getActivityIcon(activity)}

                                        <div style={{ flex: 1 }}>
                                            <strong style={{ fontSize: '0.9rem', display: 'block' }}>
                                            {activity.text}
                                            </strong>
                                            <p style={{
                                                     fontSize: '0.75rem',
                                                     color: '#94a3b8',
                                                     margin: '0.15rem 0 0 0',
                                                       }}>
                                               {new Date(activity.date).toLocaleString("pt-PT", {
                                                     day: "2-digit",
                                                     month: "2-digit",
                                                     year: "numeric",
                                                     hour: "2-digit",
                                                     minute: "2-digit"
                                                          })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        );
    };

    return (
        <div className="admin-layout">
            <AdminSidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="admin-content">

                {renderPage()}
            </main>
        </div>
    );
}