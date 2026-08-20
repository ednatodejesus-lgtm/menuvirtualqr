import React, { useState } from 'react';
import {
    BookOpen,
    FolderOpen,
    Package,
    Settings,
    Palette,
    QrCode,
    HelpCircle,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Play,
    FileText,
    Image,
    Store,
    Users,
    Shield,
    Sparkles,
    Link2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Card from './ui/Card';

export default function Help() {
    const { profile, restaurant } = useAuth();
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (sectionId) => {
        setExpandedSection(expandedSection === sectionId ? null : sectionId);
    };

    // ============================================================
    // DADOS DO GUIA
    // ============================================================
    const sections = [
        {
            id: 'categories',
            icon: FolderOpen,
            title: 'Criar Categorias',
            description: 'Organize o seu menu por categorias para facilitar a navegação dos clientes.',
            steps: [
                {
                    title: 'Aceder a Categorias',
                    description: 'No menu lateral, clique em "Categorias" para aceder à página de gestão de categorias.',
                    icon: FolderOpen,
                },
                {
                    title: 'Adicionar Nova Categoria',
                    description: 'Digite o nome da categoria (ex: "Entradas", "Pratos Principais", "Bebidas") e clique em "Adicionar Categoria".',
                    icon: FileText,
                },
                {
                    title: 'Organizar Categorias',
                    description: 'As categorias aparecerão no menu público pela ordem em que foram criadas. Pode editá-las a qualquer momento.',
                    icon: CheckCircle,
                },
                {
                    title: 'Dica Importante',
                    description: 'Crie pelo menos 3-4 categorias para organizar bem o seu menu. Exemplo: Entradas, Pratos Principais, Sobremesas e Bebidas.',
                    icon: Sparkles,
                    isTip: true,
                }
            ]
        },
        {
            id: 'products',
            icon: Package,
            title: 'Criar Produtos',
            description: 'Adicione os itens do seu menu com imagens, descrições e preços.',
            steps: [
                {
                    title: 'Aceder a Produtos',
                    description: 'No menu lateral, clique em "Produtos" para aceder à página de gestão de produtos.',
                    icon: Package,
                },
                {
                    title: 'Adicionar Novo Produto',
                    description: 'Clique em "Novo Produto" e preencha: Nome, Categoria, Preço, Descrição e Imagem (opcional).',
                    icon: FileText,
                },
                {
                    title: 'Adicionar Imagem',
                    description: 'Clique em "Escolher imagem" para selecionar uma foto do produto. A imagem ajuda a atrair clientes.',
                    icon: Image,
                },
                {
                    title: 'Disponibilidade',
                    description: 'Use o checkbox "Disponível" para controlar se o produto aparece no menu público.',
                    icon: CheckCircle,
                },
                {
                    title: 'Dica Importante',
                    description: 'Produtos com imagens atraem 80% mais atenção! Tire fotos claras e com boa iluminação.',
                    icon: Sparkles,
                    isTip: true,
                }
            ]
        },
        {
            id: 'settings',
            icon: Settings,
            title: 'Alterar Informações do Restaurante',
            description: 'Mantenha os dados do seu restaurante sempre atualizados.',
            steps: [
                {
                    title: 'Aceder a Configurações',
                    description: 'No menu lateral, clique em "Configurações" para aceder à página de definições.',
                    icon: Settings,
                },
                {
                    title: 'Informações Gerais',
                    description: 'Atualize o nome, contacto, endereço e tipo de negócio do seu restaurante.',
                    icon: Store,
                },
                {
                    title: 'Redes Sociais',
                    description: 'Adicione os links do Instagram, Facebook, TikTok e WhatsApp para os clientes te seguirem.',
                    icon: Link2,
                },
                {
                    title: 'Logo do Restaurante',
                    description: 'Faça upload do seu logo para aparecer no menu público e no QR Code.',
                    icon: Image,
                },
                {
                    title: 'Dica Importante',
                    description: 'Mantenha os contactos atualizados para que os clientes possam entrar em contacto facilmente.',
                    icon: Sparkles,
                    isTip: true,
                }
            ]
        },
        {
            id: 'appearance',
            icon: Palette,
            title: 'Personalizar Aparência do Site',
            description: 'Dê uma identidade visual única ao seu menu digital.',
            steps: [
                {
                    title: 'Aceder a Aparência',
                    description: 'Nas Configurações, clique na aba "Cores e Fontes" para personalizar o visual.',
                    icon: Palette,
                },
                {
                    title: 'Alterar Cores',
                    description: 'Selecione novas cores para o seu site. Use o preview para ver como fica antes de guardar.',
                    icon: Sparkles,
                },
                {
                    title: 'Usar Sugestões da IA',
                    description: 'Clique em "Sugestão IA" para receber recomendações de cores baseadas no tipo do seu negócio.',
                    icon: Sparkles,
                },
                {
                    title: 'Alterar Fontes',
                    description: 'Escolha entre várias fontes para títulos, corpo de texto e destaques.',
                    icon: FileText,
                },
                {
                    title: 'Reverter Cores',
                    description: 'Se não gostar das alterações, clique em "Reverter" para voltar às cores originais.',
                    icon: CheckCircle,
                },
                {
                    title: 'Dica Importante',
                    description: 'Cores que combinam com o seu logo criam uma identidade visual mais forte!',
                    icon: Sparkles,
                    isTip: true,
                }
            ]
        },
        {
            id: 'qr',
            icon: QrCode,
            title: 'Utilizar QR Code',
            description: 'Gere e utilize o QR Code para que os clientes acedam ao menu digital.',
            steps: [
                {
                    title: 'Aceder a QR Code',
                    description: 'No menu lateral, clique em "QR Code" para aceder à página de gestão do QR.',
                    icon: QrCode,
                },
                {
                    title: 'Baixar QR Code',
                    description: 'Clique em "Baixar QR Code" para descarregar a imagem do QR Code para o seu computador.',
                    icon: FileText,
                },
                {
                    title: 'Imprimir e Colocar',
                    description: 'Imprima o QR Code e coloque-o nas mesas, na porta ou no balcão do seu restaurante.',
                    icon: Image,
                },
                {
                    title: 'Link Direto',
                    description: 'Copie o link do menu para partilhar nas redes sociais ou por WhatsApp.',
                    icon: Link2,
                },
                {
                    title: 'Dica Importante',
                    description: 'Coloque o QR Code em locais visíveis e com boa iluminação para facilitar a leitura.',
                    icon: Sparkles,
                    isTip: true,
                }
            ]
        }
    ];

    // ============================================================
    // RENDERIZAR GUIA
    // ============================================================
    return (
        <div className="admin-help">
            <Card title="Ajuda e Suporte">
                <div className="help-header">
                    <h2>Bem-vindo ao Guia do Menu Virtual QR</h2>
                    <p>
                        Este guia vai ajudar-te a gerir o teu restaurante na plataforma.
                        Escolhe um tópico abaixo para aprenderes como fazer.
                    </p>
                    <p className="help-restaurant-info">
                        <Store size={16} />
                        Restaurante: <strong>{restaurant?.name || profile?.full_name || 'Configurar'}</strong>
                        {' '}·{' '}
                        <span className="help-business-type">{restaurant?.business_type || 'Tipo de negócio'}</span>
                    </p>
                </div>

                <div className="help-sections">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isExpanded = expandedSection === section.id;

                        return (
                            <div key={section.id} className="help-section">
                                <button
                                    className={`help-section-header ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <div className="help-section-header-left">
                                        <Icon size={24} className="help-section-icon" />
                                        <div>
                                            <h3>{section.title}</h3>
                                            <p className="help-section-description">{section.description}</p>
                                        </div>
                                    </div>
                                    <div className="help-section-header-right">
                                        <span className="help-step-count">
                                            {section.steps.length} passos
                                        </span>
                                        {isExpanded ? (
                                            <ChevronDown size={20} />
                                        ) : (
                                            <ChevronRight size={20} />
                                        )}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="help-section-content">
                                        <ol className="help-steps">
                                            {section.steps.map((step, index) => {
                                                const StepIcon = step.icon;
                                                return (
                                                    <li key={index} className={`help-step ${step.isTip ? 'help-step-tip' : ''}`}>
                                                        <div className="help-step-number">{index + 1}</div>
                                                        <div className="help-step-content">
                                                            <div className="help-step-header">
                                                                <StepIcon size={16} className="help-step-icon" />
                                                                <h4>{step.title}</h4>
                                                                {step.isTip && (
                                                                    <span className="help-step-badge">💡 Dica</span>
                                                                )}
                                                            </div>
                                                            <p className="help-step-description">{step.description}</p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="help-footer">
                    <div className="help-footer-content">
                        <div className="help-footer-info">
                            <Shield size={20} />
                            <div>
                                <h4>Precisa de mais ajuda?</h4>
                                <p>
                                    Entre em contacto com o suporte em{' '}
                                    <a href="mailto:suporte@menuvirtualqr.com">suporte@menuvirtualqr.com</a>
                                </p>
                            </div>
                        </div>
                        <div className="help-footer-support">
                            <Users size={20} />
                            <div>
                                <h4>Suporte ao Cliente</h4>
                                <p>Resposta em até 24h</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <style jsx>{`
                .admin-help {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .help-header {
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                }

                .help-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 0.5rem;
                }

                .help-header p {
                    color: #64748b;
                    font-size: 0.95rem;
                    margin: 0.25rem 0;
                }

                .help-restaurant-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.75rem !important;
                    padding: 0.5rem 0.75rem;
                    background: #f1f5f9;
                    border-radius: 8px;
                    font-size: 0.875rem !important;
                }

                .help-business-type {
                    color: #8B4513;
                    font-weight: 500;
                }

                .help-sections {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                }

                .help-section {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.2s;
                    background: white;
                }

                .help-section:hover {
                    border-color: #cbd5e1;
                }

                .help-section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .help-section-header:hover {
                    background: #f8fafc;
                }

                .help-section-header.expanded {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }

                .help-section-header-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .help-section-icon {
                    color: #8B4513;
                    flex-shrink: 0;
                }

                .help-section-header-left h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #0f172a;
                    margin: 0;
                }

                .help-section-description {
                    font-size: 0.85rem;
                    color: #64748b;
                    margin: 0.15rem 0 0 0;
                }

                .help-section-header-right {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    flex-shrink: 0;
                }

                .help-step-count {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    background: #f1f5f9;
                    padding: 0.15rem 0.6rem;
                    border-radius: 12px;
                }

                .help-section-content {
                    padding: 1.25rem;
                }

                .help-steps {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .help-step {
                    display: flex;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    background: #f8fafc;
                    transition: all 0.2s;
                }

                .help-step:hover {
                    background: #f1f5f9;
                }

                .help-step-tip {
                    background: #fef3e8;
                    border: 1px solid #fed7aa;
                }

                .help-step-tip:hover {
                    background: #fde8d8;
                }

                .help-step-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    min-width: 24px;
                    border-radius: 50%;
                    background: #8B4513;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .help-step-tip .help-step-number {
                    background: #DAA520;
                }

                .help-step-content {
                    flex: 1;
                }

                .help-step-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                }

                .help-step-icon {
                    color: #8B4513;
                }

                .help-step-tip .help-step-icon {
                    color: #DAA520;
                }

                .help-step-header h4 {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #0f172a;
                    margin: 0;
                }

                .help-step-badge {
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: #92400e;
                    background: #fde68a;
                    padding: 0.1rem 0.5rem;
                    border-radius: 12px;
                }

                .help-step-description {
                    font-size: 0.85rem;
                    color: #475569;
                    margin: 0.15rem 0 0 0;
                    line-height: 1.5;
                }

                .help-footer {
                    border-top: 1px solid #e2e8f0;
                    padding-top: 1.5rem;
                    margin-top: 0.5rem;
                }

                .help-footer-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .help-footer-info,
                .help-footer-support {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    background: #f8fafc;
                }

                .help-footer-info svg,
                .help-footer-support svg {
                    color: #8B4513;
                    margin-top: 0.1rem;
                }

                .help-footer-info h4,
                .help-footer-support h4 {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #0f172a;
                    margin: 0;
                }

                .help-footer-info p,
                .help-footer-support p {
                    font-size: 0.8rem;
                    color: #64748b;
                    margin: 0.1rem 0 0 0;
                }

                .help-footer-info a {
                    color: #8B4513;
                    text-decoration: none;
                }

                .help-footer-info a:hover {
                    text-decoration: underline;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .help-section-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }

                    .help-section-header-right {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .help-footer-content {
                        grid-template-columns: 1fr;
                    }

                    .help-step {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .help-step-number {
                        align-self: flex-start;
                    }
                }
            `}</style>
        </div>
    );
}