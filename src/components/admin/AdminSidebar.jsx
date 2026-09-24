import { useState } from 'react'; // Importar useState
import {
    LayoutDashboard,
    FolderOpen,
    Package,
    QrCode,
    Settings,
    HelpCircle,
    LogOut,
    Tag,
    Menu, // Ícone de Hambúrguer
    X     // Ícone de Fechar
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

export default function AdminSidebar({
    activePage,
    setActivePage
}) {
    const { logout, restaurant } = useAuth();
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar o menu mobile

    const menu = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "categories", label: "Categorias", icon: FolderOpen },
        { id: "products", label: "Produtos", icon: Package },
        { id: "promotions", label: "Promoções", icon: Tag },
        { id: "qrcode", label: "QR Code", icon: QrCode },
        { id: "settings", label: "Configurações", icon: Settings },
        { id: "help", label: "Ajuda e Suporte", icon: HelpCircle },
    ];

    const handleLogout = async () => {
        const confirmLogout = window.confirm('Tem certeza que deseja sair?');
        if (confirmLogout) {
            await logout();
            window.location.href = '/login';
        }
    };

    // Função para mudar de página e fechar o menu no mobile
    const handleNavigation = (id) => {
        setActivePage(id);
        setIsOpen(false); // Fecha o menu automaticamente ao clicar
    };

    return (
        <>
            {/* Botão Hambúrguer (Só aparece no Mobile) */}
            <button 
                className="mobile-menu-toggle" 
                onClick={() => setIsOpen(true)}
            >
                <Menu size={24} />
            </button>

            {/* Overlay escuro (Só aparece quando o menu está aberto) */}
            <div 
                className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
                onClick={() => setIsOpen(false)}
            ></div>

            {/* A Barra Lateral */}
            <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu QR</h2>
                    {/* Botão de Fechar (Só aparece no Mobile) */}
                    <button 
                        className="mobile-menu-close" 
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav>
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;

                        return (
                            <button
                                key={item.id}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                                onClick={() => handleNavigation(item.id)} // Usa a nova função
                            >
                                <Icon size={16} />
                                <span className='sidebar-text' >{item.label}</span>
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
        </>
    );
}