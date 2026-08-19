import {
    useEffect,
    useState
} from "react";

import {
    FaImage,
    FaPalette,
    FaFont,
    FaEye,
    FaSave,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCog,
    FaPaintBrush,
    FaTh,
    FaList,
    FaSquare,
    FaGlobe
} from 'react-icons/fa';


import {
    Layout,
    Layers,
    Grid,
    Menu,
    Home,
    Settings,
    Palette,
    Type,
    Image,
    Eye,
    Save,
    Loader2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

import {
    useAuth
} from "../../../hooks/useAuth";

import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";

// ============================================================
// CONFIGURAÇÕES DOS COMPONENTES
// ============================================================

const HERO_VARIANTS = [
    { value: 'fullscreen', label: 'Fullscreen' },
    { value: 'split', label: 'Split' },
    { value: 'centered', label: 'Centered' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'compact', label: 'Compact' },
];

const HERO_HEIGHTS = [
    { value: 'fullscreen', label: 'Fullscreen (100vh)' },
    { value: 'large', label: 'Large (80vh)' },
    { value: 'medium', label: 'Medium (60vh)' },
    { value: 'compact', label: 'Compact (40vh)' },
];

const NAVIGATION_VARIANTS = [
    { value: 'overlay', label: 'Overlay' },
    { value: 'floating', label: 'Floating' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'classic', label: 'Classic' },
];

const CATEGORY_VARIANTS = [
    { value: 'tabs', label: 'Tabs' },
    { value: 'pills', label: 'Pills' },
    { value: 'floating', label: 'Floating' },
    { value: 'horizontal', label: 'Horizontal Scroll' },
    { value: 'sidebar', label: 'Sidebar' },
];

const MENU_VARIANTS = [
    { value: 'grid', label: 'Grid' },
    { value: 'editorial-grid', label: 'Editorial Grid' },
    { value: 'list', label: 'List' },
    { value: 'immersive', label: 'Immersive' },
    { value: 'showcase', label: 'Showcase' },
];

const CARD_VARIANTS = [
    { value: 'grid', label: 'Grid' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'immersive', label: 'Immersive' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'list', label: 'List' },
];

const IMAGE_RATIOS = [
    { value: 'square', label: 'Square (1:1)' },
    { value: 'portrait', label: 'Portrait (3:4)' },
    { value: 'landscape', label: 'Landscape (4:3)' },
    { value: 'cinematic', label: 'Cinematic (16:9)' },
];

const FOOTER_VARIANTS = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'immersive', label: 'Immersive' },
    { value: 'dark', label: 'Dark' },
];

const FOOTER_ALIGNMENTS = [
    { value: 'center', label: 'Center' },
    { value: 'split', label: 'Split' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
];

const DENSITY_OPTIONS = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
    { value: 'cinematic', label: 'Cinematic' },
];

const PRICE_EMPHASIS = [
    { value: 'bold', label: 'Bold' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'strong', label: 'Strong' },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AppearanceSettings() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    const [form, setForm] = useState({
        // Hero
        hero_title: "",
        hero_subtitle: "",
        hero_cta_text: "",
        hero_secondary_cta: "",
        hero_image_url: "",
        hero_variant: "fullscreen",
        hero_height: "large",
        hero_alignment: "center",
        hero_overlay_strength: 0.5,
        hero_image_treatment: "natural",
        hero_visual_priority: "image",

        // Navigation
        nav_variant: "floating",
        nav_position: "floating",

        // Categories
        categories_variant: "pills",
        categories_position: "sticky",

        // Menu
        menu_variant: "grid",
        menu_card_variant: "immersive",
        menu_image_ratio: "portrait",
        menu_price_emphasis: "strong",
        menu_image_priority: "high",
        menu_description_style: "minimal",

        // Footer
        footer_variant: "dark",
        footer_alignment: "split",

        // Layout
        density: "compact",
        content_width: "standard",
    });

    const restaurantId = profile?.restaurant_id;

    useEffect(() => {
        loadAppearance();
    }, [restaurantId]);

    async function loadAppearance() {
        if (!restaurantId) return;

        try {
            const data = await getRestaurantSettings(restaurantId);
            const theme = data.theme || {};

            setForm({
                hero_title: theme.hero?.title || "",
                hero_subtitle: theme.hero?.subtitle || "",
                hero_cta_text: theme.hero?.cta_text || "Ver Menu",
                hero_secondary_cta: theme.hero?.secondary_cta || "",
                hero_image_url: theme.hero?.image_url || "",
                hero_variant: theme.layout?.hero?.variant || "fullscreen",
                hero_height: theme.layout?.hero?.height || "large",
                hero_alignment: theme.layout?.hero?.alignment || "center",
                hero_overlay_strength: theme.hero?.overlay_strength || 0.5,
                hero_image_treatment: theme.hero?.image_treatment || "natural",
                hero_visual_priority: theme.hero?.visual_priority || "image",

                nav_variant: theme.layout?.navigation?.variant || "floating",
                nav_position: theme.layout?.navigation?.position || "floating",

                categories_variant: theme.layout?.categories?.variant || "pills",
                categories_position: theme.layout?.categories?.position || "sticky",

                menu_variant: theme.layout?.menu?.variant || "grid",
                menu_card_variant: theme.layout?.menu?.card_variant || "immersive",
                menu_image_ratio: theme.layout?.menu?.image_ratio || "portrait",
                menu_price_emphasis: theme.layout?.menu?.price_emphasis || "strong",
                menu_image_priority: theme.layout?.menu?.image_priority || "high",
                menu_description_style: theme.layout?.menu?.description_style || "minimal",

                footer_variant: theme.layout?.footer?.variant || "dark",
                footer_alignment: theme.layout?.footer?.alignment || "split",

                density: theme.layout?.density || "compact",
                content_width: theme.layout?.content_width || "standard",
            });
        } catch (error) {
            console.error("Erro ao carregar aparência:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
        if (success) setSuccess(false);
    }

    function handleRangeChange(e) {
        setForm({
            ...form,
            [e.target.name]: parseFloat(e.target.value)
        });
    }

    function buildTheme() {
        return {
            hero: {
                title: form.hero_title,
                subtitle: form.hero_subtitle,
                cta_text: form.hero_cta_text,
                secondary_cta: form.hero_secondary_cta,
                image_url: form.hero_image_url,
                image_treatment: form.hero_image_treatment,
                visual_priority: form.hero_visual_priority,
                overlay_strength: form.hero_overlay_strength,
            },
            layout: {
                hero: {
                    height: form.hero_height,
                    variant: form.hero_variant,
                    alignment: form.hero_alignment,
                },
                navigation: {
                    variant: form.nav_variant,
                    position: form.nav_position,
                },
                categories: {
                    variant: form.categories_variant,
                    position: form.categories_position,
                },
                menu: {
                    variant: form.menu_variant,
                    card_variant: form.menu_card_variant,
                    image_ratio: form.menu_image_ratio,
                    price_emphasis: form.menu_price_emphasis,
                    image_priority: form.menu_image_priority,
                    description_style: form.menu_description_style,
                },
                footer: {
                    variant: form.footer_variant,
                    alignment: form.footer_alignment,
                },
                density: form.density,
                content_width: form.content_width,
            }
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setSaving(true);
            setSuccess(false);

            const theme = buildTheme();

            await updateRestaurantSettings(restaurantId, {
                theme: theme
            });

            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error("Erro ao atualizar aparência:", error);
            alert("Erro ao guardar aparência");
        } finally {
            setSaving(false);
        }
    }

    // 🔥 RENDERIZAR TABS - CORRIGIDO COM ÍCONES DO LUCIDE
    function renderTabs() {
        const tabs = [
            { id: 'hero', label: 'Hero', icon: Eye },
            { id: 'menu', label: 'Menu', icon: Layout },
            { id: 'footer', label: 'Footer', icon: Palette },
            { id: 'advanced', label: 'Avançado', icon: Settings },
        ];

        return (
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.5rem',
                flexWrap: 'wrap'
            }}>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: activeTab === tab.id ? '#8B4513' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#475569',
                                border: activeTab === tab.id ? '1px solid #8B4513' : '1px solid transparent',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: activeTab === tab.id ? '600' : '500',
                                transition: 'all 0.2s',
                                fontSize: '0.875rem'
                            }}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        );
    }

    //  RENDERIZAR CONTEÚDO DAS TABS
    function renderTabContent() {
        switch (activeTab) {
            case 'hero':
                return renderHeroTab();
            case 'menu':
                return renderMenuTab();
            case 'footer':
                return renderFooterTab();
            case 'advanced':
                return renderAdvancedTab();
            default:
                return null;
        }
    }

    //  TAB: HERO
    function renderHeroTab() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    <Eye size={18} style={{ marginRight: '0.5rem' }} />
                    Configurações do Hero
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                        label="Título"
                        name="hero_title"
                        value={form.hero_title}
                        onChange={handleChange}
                        placeholder="Bruce's Fire & Flavor"
                    />

                    <Input
                        label="Subtítulo"
                        name="hero_subtitle"
                        value={form.hero_subtitle}
                        onChange={handleChange}
                        placeholder="Pizza with attitude, made fast."
                    />

                    <Input
                        label="Texto do CTA Principal"
                        name="hero_cta_text"
                        value={form.hero_cta_text}
                        onChange={handleChange}
                        placeholder="Ver Menu"
                    />

                    <Input
                        label="Texto do CTA Secundário"
                        name="hero_secondary_cta"
                        value={form.hero_secondary_cta}
                        onChange={handleChange}
                        placeholder="Order Now"
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                        <Input
                            label="URL da Imagem do Hero"
                            name="hero_image_url"
                            value={form.hero_image_url}
                            onChange={handleChange}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>

                    <Select
                        label="Variante do Hero"
                        name="hero_variant"
                        value={form.hero_variant}
                        onChange={handleChange}
                        options={HERO_VARIANTS}
                    />

                    <Select
                        label="Altura do Hero"
                        name="hero_height"
                        value={form.hero_height}
                        onChange={handleChange}
                        options={HERO_HEIGHTS}
                    />

                    <Select
                        label="Alinhamento"
                        name="hero_alignment"
                        value={form.hero_alignment}
                        onChange={handleChange}
                        options={[
                            { value: 'center', label: 'Centro' },
                            { value: 'left', label: 'Esquerda' },
                            { value: 'right', label: 'Direita' },
                        ]}
                    />

                    <Select
                        label="Tratamento da Imagem"
                        name="hero_image_treatment"
                        value={form.hero_image_treatment}
                        onChange={handleChange}
                        options={[
                            { value: 'natural', label: 'Natural' },
                            { value: 'cinematic', label: 'Cinematográfico' },
                            { value: 'dramatic', label: 'Dramático' },
                        ]}
                    />

                    <Select
                        label="Prioridade Visual"
                        name="hero_visual_priority"
                        value={form.hero_visual_priority}
                        onChange={handleChange}
                        options={[
                            { value: 'image', label: 'Imagem' },
                            { value: 'content', label: 'Conteúdo' },
                        ]}
                    />

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155' }}>
                            Intensidade do Overlay: {form.hero_overlay_strength}
                        </label>
                        <input
                            type="range"
                            name="hero_overlay_strength"
                            min="0"
                            max="1"
                            step="0.05"
                            value={form.hero_overlay_strength}
                            onChange={handleRangeChange}
                            style={{
                                width: '100%',
                                accentColor: '#8B4513',
                                marginTop: '0.25rem'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // TAB: MENU
    function renderMenuTab() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    <Layout size={18} style={{ marginRight: '0.5rem' }} />
                    Configurações do Menu
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Select
                        label="Variante do Menu"
                        name="menu_variant"
                        value={form.menu_variant}
                        onChange={handleChange}
                        options={MENU_VARIANTS}
                    />

                    <Select
                        label="Variante do Card"
                        name="menu_card_variant"
                        value={form.menu_card_variant}
                        onChange={handleChange}
                        options={CARD_VARIANTS}
                    />

                    <Select
                        label="Proporção da Imagem"
                        name="menu_image_ratio"
                        value={form.menu_image_ratio}
                        onChange={handleChange}
                        options={IMAGE_RATIOS}
                    />

                    <Select
                        label="Ênfase no Preço"
                        name="menu_price_emphasis"
                        value={form.menu_price_emphasis}
                        onChange={handleChange}
                        options={PRICE_EMPHASIS}
                    />

                    <Select
                        label="Prioridade da Imagem"
                        name="menu_image_priority"
                        value={form.menu_image_priority}
                        onChange={handleChange}
                        options={[
                            { value: 'high', label: 'Alta' },
                            { value: 'medium', label: 'Média' },
                            { value: 'low', label: 'Baixa' },
                        ]}
                    />

                    <Select
                        label="Estilo da Descrição"
                        name="menu_description_style"
                        value={form.menu_description_style}
                        onChange={handleChange}
                        options={[
                            { value: 'full', label: 'Completa' },
                            { value: 'minimal', label: 'Minimal' },
                            { value: 'none', label: 'Sem descrição' },
                        ]}
                    />

                    <Select
                        label="Variante das Categorias"
                        name="categories_variant"
                        value={form.categories_variant}
                        onChange={handleChange}
                        options={CATEGORY_VARIANTS}
                    />

                    <Select
                        label="Posição das Categorias"
                        name="categories_position"
                        value={form.categories_position}
                        onChange={handleChange}
                        options={[
                            { value: 'static', label: 'Estático' },
                            { value: 'sticky', label: 'Fixado (Sticky)' },
                        ]}
                    />

                    <Select
                        label="Densidade"
                        name="density"
                        value={form.density}
                        onChange={handleChange}
                        options={DENSITY_OPTIONS}
                    />

                    <Select
                        label="Largura do Conteúdo"
                        name="content_width"
                        value={form.content_width}
                        onChange={handleChange}
                        options={[
                            { value: 'narrow', label: 'Estreito' },
                            { value: 'standard', label: 'Padrão' },
                            { value: 'wide', label: 'Largo' },
                            { value: 'full', label: 'Full Width' },
                        ]}
                    />
                </div>
            </div>
        );
    }

    // 🔥 TAB: FOOTER
    function renderFooterTab() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    <Palette size={18} style={{ marginRight: '0.5rem' }} />
                    Configurações do Footer
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Select
                        label="Variante do Footer"
                        name="footer_variant"
                        value={form.footer_variant}
                        onChange={handleChange}
                        options={FOOTER_VARIANTS}
                    />

                    <Select
                        label="Alinhamento do Footer"
                        name="footer_alignment"
                        value={form.footer_alignment}
                        onChange={handleChange}
                        options={FOOTER_ALIGNMENTS}
                    />

                    <Select
                        label="Variante da Navegação"
                        name="nav_variant"
                        value={form.nav_variant}
                        onChange={handleChange}
                        options={NAVIGATION_VARIANTS}
                    />

                    <Select
                        label="Posição da Navegação"
                        name="nav_position"
                        value={form.nav_position}
                        onChange={handleChange}
                        options={[
                            { value: 'top', label: 'Topo' },
                            { value: 'bottom', label: 'Baixo' },
                            { value: 'floating', label: 'Flutuante' },
                        ]}
                    />
                </div>
            </div>
        );
    }

    // 🔥 TAB: AVANÇADO
    function renderAdvancedTab() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                    <Settings size={18} style={{ marginRight: '0.5rem' }} />
                    Configurações Avançadas
                </h3>

                <div style={{
                    padding: '1rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fcd34d',
                    marginBottom: '1rem'
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e' }}>
                        ⚠️ Estas configurações são avançadas. Altere apenas se souber o que está fazendo.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                            Preview do JSON do Tema
                        </label>
                        <pre style={{
                            background: '#1e293b',
                            color: '#e2e8f0',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            overflow: 'auto',
                            maxHeight: '300px',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {JSON.stringify(buildTheme(), null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <Card title="Aparência">
                <p style={{ color: '#64748b' }}>Carregando aparência...</p>
            </Card>
        );
    }

    return (
        <Card title="🎨 Personalização do Site">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {renderTabs()}
                {renderTabContent()}

                {success && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '8px',
                        border: '1px solid #86efac',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <CheckCircle2 size={16} />
                        Aparência atualizada com sucesso!
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#8B4513',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    {saving ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Guardar Aparência
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}