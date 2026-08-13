import { useEffect, useState, useCallback, useRef } from "react";

import {
    Store,
    FolderOpen,
    Package,
    QrCode,
    Utensils,
    Eye,
    Clock,
    Trash2,
    Plus,
    Edit,
    RefreshCw,
    CheckCircle,
    XCircle
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
import AdminHeader from "../components/admin/AdminHeader";

import AdminCategories from "../components/admin/AdminCategories";
import AdminProducts from "../components/admin/AdminProducts";
import AdminQRCode from "../components/admin/AdminQRCode";
import AdminSettings from "../components/admin/AdminSettings";

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
            case "qrcode":
                return <AdminQRCode />;
            case "settings":
                return <AdminSettings />;
            default:
                return renderDashboard();
        }
    };

    // Renderizar Dashboard
    const renderDashboard = () => {
        // Mapear tipo de atividade para ícone
        const getActivityIcon = (type) => {
            switch (type) {
                case 'category': return <FolderOpen size={16} />;
                case 'product': return <Package size={16} />;
                case 'qr': return <QrCode size={16} />;
                case 'restaurant': return <Store size={16} />;
                case 'audit':
                case 'DELETE': return <Trash2 size={16} />;
                case 'INSERT': return <Plus size={16} />;
                case 'UPDATE': return <RefreshCw size={16} />;
                default: return <Clock size={16} />;
            }
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
                                    >
                                        <div className="activity-icon">
                                            {getActivityIcon(activity.type)}
                                        </div>

                                        <div>
                                            <strong>{activity.text}</strong>
                                            <p>
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
                <AdminHeader
                    profile={profile}
                    restaurant={restaurant}
                    logout={logout}
                />

                {renderPage()}
            </main>
        </div>
    );
}