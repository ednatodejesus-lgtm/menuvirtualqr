import {
    LayoutDashboard,
    FolderOpen,
    Package,
    QrCode,
    Settings,
    HelpCircle,
    LogOut,
    Store
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

export default function AdminSidebar({
    activePage,
    setActivePage
}) {
    const { logout, restaurant } = useAuth();

    const menu = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            id: "categories",
            label: "Categorias",
            icon: FolderOpen,
        },
        {
            id: "products",
            label: "Produtos",
            icon: Package,
        },
        {
            id: "qrcode",
            label: "QR Code",
            icon: QrCode,
        },
        {
            id: "settings",
            label: "Configurações",
            icon: Settings,
        },
        {
            id: "help",
            label: "Ajuda e Suporte",
            icon: HelpCircle,
        },
    ];

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Tem certeza que deseja sair?');
        if (confirmLogout) {
            await logout();
            window.location.href = '/login';
        }
    };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Menu QR</h2>
            </div>

            <nav>
                {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <button
                            key={item.id}
                            className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setActivePage(item.id)}
                        >
                            <Icon size={16} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-nav-item sidebar-logout"
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}