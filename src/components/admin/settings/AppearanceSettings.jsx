import {
    useEffect,
    useState,
    useRef
} from "react";

import {
    FaImage,
    FaPalette,
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
    FaGlobe,
    FaUpload,
    FaTrash,
    FaRobot,
    FaUndo
} from 'react-icons/fa';

import {
    Layout,
    Settings,
    Palette,
    Eye,
    Save,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Upload,
    Trash2,
    Paintbrush,
    Sparkles,
    RotateCcw
} from 'lucide-react';

import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

import {
    useAuth
} from "../../../hooks/useAuth";
import { useColorSuggestions } from '../../../hooks/useColorSuggestions';

import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";

import { supabase } from "../../../services/supabase";

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
// CORES PREDEFINIDAS
// ============================================================

const PREDEFINED_COLORS = [
    '#E63946', '#F4A261', '#E9C46A', '#2A9D8F', '#264653',
    '#8B4513', '#DAA520', '#1A0F0A', '#2C1810', '#3D2318',
    '#DC3545', '#FFC107', '#28A745', '#17A2B8', '#6F42C1',
    '#E83E8C', '#FD7E14', '#20C997', '#0DCAF0', '#6610F2',
    '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA',
    '#ADB5BD', '#6C757D', '#495057', '#343A40', '#212529',
    '#0D0D0D', '#1A1A1A', '#2C2C2C', '#3D3D3D', '#4D4D4D',
];

const FONT_OPTIONS = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Playfair Display', label: 'Playfair Display' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Bebas Neue', label: 'Bebas Neue' },
    { value: 'Syne', label: 'Syne' },
    { value: 'DM Sans', label: 'DM Sans' },
    { value: 'Space Grotesk', label: 'Space Grotesk' },
];

// ============================================================
// FUNÇÃO DE CONTRASTE
// ============================================================

function getContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
        const rgb = parseInt(hex.replace('#', ''), 16);
        const r = ((rgb >> 16) & 0xFF) / 255;
        const g = ((rgb >> 8) & 0xFF) / 255;
        const b = (rgb & 0xFF) / 255;
        const [rs, gs, bs] = [r, g, b].map(c => 
            c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio;
}

function isContrastValid(textColor, bgColor) {
    const ratio = getContrastRatio(textColor, bgColor);
    return ratio >= 4.5; // WCAG AA
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AppearanceSettings() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    // 🔥 Estado para cores originais (reverter)
    const [originalColors, setOriginalColors] = useState(null);

    // 🔥 CORRIGIDO: Remover o useState duplicado e usar apenas o do hook
    const { getSuggestions, loading: suggestionsLoading } = useColorSuggestions();

    // 🔥 Estado para controlar se estamos na tab de cores
    const isColorsTab = activeTab === 'colors';

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

        // Cores
        color_primary: "#8B4513",
        color_secondary: "#DAA520",
        color_accent: "#F5DEB3",
        color_background: "#1A0F0A",
        color_surface: "#2C1810",
        color_text: "#FFFFFF",
        color_text_muted: "#94A3B8",

        // Fontes
        font_heading: "Playfair Display",
        font_body: "Inter",
        font_accent: "Lato",
    });

    const [contrastErrors, setContrastErrors] = useState([]);

    const restaurantId = profile?.restaurant_id;
    const businessType = profile?.business_type || 'default';

    useEffect(() => {
        loadAppearance();
    }, [restaurantId]);

    // 🔥 VALIDAR CONTRASTE - APENAS NA TAB DE CORES
    useEffect(() => {
        if (isColorsTab) {
            validateContrast();
        } else {
            setContrastErrors([]);
        }
    }, [
        isColorsTab,
        form.color_background,
        form.color_text,
        form.color_text_muted,
        form.color_primary,
        form.color_secondary,
        form.color_accent,
        form.color_surface
    ]);

    function validateContrast() {
        const errors = [];
        const bg = form.color_background;
        const surface = form.color_surface;

        // Texto vs Fundo
        if (!isContrastValid(form.color_text, bg)) {
            errors.push('O texto principal tem baixo contraste com o fundo.');
        }
        if (!isContrastValid(form.color_text_muted, bg)) {
            errors.push('O texto secundário tem baixo contraste com o fundo.');
        }
        if (!isContrastValid(form.color_primary, bg)) {
            errors.push('A cor primária tem baixo contraste com o fundo.');
        }
        if (!isContrastValid(form.color_secondary, bg)) {
            errors.push('A cor secundária tem baixo contraste com o fundo.');
        }

        // Texto vs Surface (cards)
        if (!isContrastValid(form.color_text, surface)) {
            errors.push('O texto principal tem baixo contraste com os cards.');
        }

        setContrastErrors(errors);
    }

    async function loadAppearance() {
        if (!restaurantId) return;

        try {
            const data = await getRestaurantSettings(restaurantId);
            const theme = data.theme || {};
            const colors = theme.visual?.colors || {};
            const typography = theme.visual?.typography || {};

            const loadedColors = {
                color_primary: colors.primary || "#8B4513",
                color_secondary: colors.secondary || "#DAA520",
                color_accent: colors.accent || "#F5DEB3",
                color_background: colors.background || "#1A0F0A",
                color_surface: colors.surface || "#2C1810",
                color_text: colors.text || "#FFFFFF",
                color_text_muted: colors.text_muted || "#94A3B8",
            };

            setOriginalColors(loadedColors);

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

                ...loadedColors,

                font_heading: typography.heading || "Playfair Display",
                font_body: typography.body || "Inter",
                font_accent: typography.accent || "Lato",
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
            // ... layout configs ...
        },
        visual: {
            colors: {
                primary: form.color_primary,
                secondary: form.color_secondary,
                accent: form.color_accent,
                background: form.color_background,
                surface: form.color_surface,
                text: form.color_text,
                text_muted: form.color_text_muted,
                // 🔥 ADICIONAR CORES DO CARD
                card: form.color_surface, // Usa a mesma cor da superfície
                border: form.color_border || '#3D2318',
                overlay: 'rgba(0,0,0,0.6)',
            },
            typography: {
                heading: form.font_heading,
                body: form.font_body,
                accent: form.font_accent,
            }
        }
    };
}

    // 🔥 FUNÇÃO PARA SUGESTÃO DE CORES POR IA (CORRIGIDA)
    async function getAIColorSuggestions() {
        try {
            // Buscar dados do restaurante
            const { data: restaurantData } = await supabase
                .from('restaurants')
                .select('name, business_type, description')
                .eq('id', restaurantId)
                .single();

            const result = await getSuggestions({
                businessType: restaurantData?.business_type || 'restaurant',
                name: restaurantData?.name || '',
                description: restaurantData?.description || ''
            });

            if (result?.colors) {
                setForm({
                    ...form,
                    color_primary: result.colors.primary,
                    color_secondary: result.colors.secondary,
                    color_accent: result.colors.accent,
                    color_background: result.colors.background,
                    color_surface: result.colors.surface,
                    color_text: result.colors.text,
                    color_text_muted: result.colors.text_muted,
                    ...(result.typography && {
                        font_heading: result.typography.heading || form.font_heading,
                        font_body: result.typography.body || form.font_body,
                        font_accent: result.typography.accent || form.font_accent,
                    })
                });
            }
        } catch (error) {
            console.error('Erro ao obter sugestões de cores:', error);
            alert('Erro ao obter sugestões de cores. Tente novamente.');
        }
    }

    // 🔥 FUNÇÃO PARA REVERTER CORES ORIGINAIS
    function revertColors() {
        if (originalColors) {
            setForm({
                ...form,
                color_primary: originalColors.color_primary || '#8B4513',
                color_secondary: originalColors.color_secondary || '#DAA520',
                color_accent: originalColors.color_accent || '#F5DEB3',
                color_background: originalColors.color_background || '#1A0F0A',
                color_surface: originalColors.color_surface || '#2C1810',
                color_text: originalColors.color_text || '#FFFFFF',
                color_text_muted: originalColors.color_text_muted || '#94A3B8',
            });
        }
    }

    // 🔥 UPLOAD DE IMAGEM DO HERO
    async function handleImageUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }

        setUploadingImage(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${restaurantId}-${Date.now()}.${fileExt}`;
            const filePath = `${restaurantId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hero')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('hero')
                .getPublicUrl(filePath);

            setForm({
                ...form,
                hero_image_url: publicUrl
            });

            alert('Imagem do Hero atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            alert('Erro ao enviar imagem. Tente novamente.');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    // 🔥 USAR LOGO DO RESTAURANTE COMO IMAGEM DO HERO
    async function useLogoAsHero() {
        try {
            const data = await getRestaurantSettings(restaurantId);
            if (data.logo_url) {
                setForm({
                    ...form,
                    hero_image_url: data.logo_url
                });
            } else {
                alert('O restaurante não possui um logo configurado.');
            }
        } catch (error) {
            console.error('Erro ao carregar logo:', error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Validar contraste apenas se estiver na tab de cores
        if (isColorsTab && contrastErrors.length > 0) {
            const confirmSave = window.confirm(
                `Existem problemas de contraste:\n\n${contrastErrors.join('\n')}\n\nDeseja continuar mesmo assim?`
            );
            if (!confirmSave) return;
        }

        try {
            setSaving(true);
            setSuccess(false);

            const theme = buildTheme();

            await updateRestaurantSettings(restaurantId, {
                theme: theme
            });

            // Atualizar cores originais após salvar
            setOriginalColors({
                color_primary: form.color_primary,
                color_secondary: form.color_secondary,
                color_accent: form.color_accent,
                color_background: form.color_background,
                color_surface: form.color_surface,
                color_text: form.color_text,
                color_text_muted: form.color_text_muted,
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

    // 🔥 RENDERIZAR TABS 
    function renderTabs() {
        const tabs = [
            { id: 'hero', label: 'Hero', icon: Eye },
            { id: 'menu', label: 'Menu', icon: Layout },
            { id: 'footer', label: 'Footer', icon: Palette },
            { id: 'colors', label: 'Cores e Fontes', icon: Paintbrush },
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

    // 🔥 RENDERIZAR CONTEÚDO DAS TABS
    function renderTabContent() {
        switch (activeTab) {
            case 'hero':
                return renderHeroTab();
            case 'menu':
                return renderMenuTab();
            case 'footer':
                return renderFooterTab();
            case 'colors':
                return renderColorsTab();
            default:
                return null;
        }
    }

    // ============================================================
    // TAB: HERO
    // ============================================================
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
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                            Imagem do Hero
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Input
                                name="hero_image_url"
                                value={form.hero_image_url}
                                onChange={handleChange}
                                placeholder="https://images.unsplash.com/..."
                                style={{ flex: 1 }}
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                id="hero-upload"
                            />
                            <label
                                htmlFor="hero-upload"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: '#f1f5f9',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#475569',
                                    opacity: uploadingImage ? 0.5 : 1
                                }}
                            >
                                {uploadingImage ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Upload size={16} />
                                )}
                                {uploadingImage ? 'Enviando...' : 'Upload'}
                            </label>
                            <button
                                type="button"
                                onClick={useLogoAsHero}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: '#fef3e8',
                                    border: '1px solid #fed7aa',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: '#8B4513'
                                }}
                            >
                                <FaImage size={16} />
                                Usar Logo
                            </button>
                            {form.hero_image_url && (
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, hero_image_url: '' })}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: '#fee2e2',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#ef4444'
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Remover
                                </button>
                            )}
                        </div>
                        {form.hero_image_url && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <img
                                    src={form.hero_image_url}
                                    alt="Preview do Hero"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '150px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '1px solid #e2e8f0'
                                    }}
                                />
                            </div>
                        )}
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

    // ============================================================
    // TAB: MENU
    // ============================================================
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

    // ============================================================
    // TAB: FOOTER
    // ============================================================
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

    // ============================================================
    // TAB: CORES E FONTES
    // ============================================================
    function renderColorsTab() {
        const businessTypeLabel = {
            'restaurant': 'Restaurante',
            'fast-food': 'Fast-Food',
            'pizza': 'Pizzaria',
            'sushi': 'Sushi',
            'cafe': 'Café',
            'bar': 'Bar',
            'hotel': 'Hotel',
            'spa': 'Spa',
            'bakery': 'Padaria',
            'default': 'Restaurante'
        }[businessType] || 'Restaurante';

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>
                        <FaPaintBrush style={{ marginRight: '0.5rem' }} />
                        Cores e Fontes
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* 🔥 BOTÃO IA - CORRIGIDO: usando suggestionsLoading */}
                        <button
                            type="button"
                            onClick={getAIColorSuggestions}
                            disabled={suggestionsLoading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 1rem',
                                background: '#8B4513',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: suggestionsLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                opacity: suggestionsLoading ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}
                        >
                            {suggestionsLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Sparkles size={14} />
                            )}
                            {suggestionsLoading ? 'A sugerir...' : 'Sugestão IA'}
                        </button>

                        {/* 🔥 BOTÃO REVERTER */}
                        <button
                            type="button"
                            onClick={revertColors}
                            disabled={!originalColors}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.4rem 1rem',
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: originalColors ? 'pointer' : 'not-allowed',
                                fontSize: '0.8rem',
                                fontWeight: '500',
                                opacity: originalColors ? 1 : 0.5,
                                transition: 'all 0.2s'
                            }}
                        >
                            <RotateCcw size={14} />
                            Reverter
                        </button>
                    </div>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                    Tipo de negócio: <strong>{businessTypeLabel}</strong>
                </p>

                {/* 🔥 AVISO DE CONTRASTE (APENAS AQUI) */}
                {contrastErrors.length > 0 && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: '8px',
                        border: '1px solid #fcd34d',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                    }}>
                        <AlertTriangle size={18} color="#92400e" style={{ marginTop: '0.15rem' }} />
                        <div>
                            <p style={{ fontWeight: '600', color: '#92400e', margin: '0 0 0.25rem 0' }}>
                                Problemas de contraste detectados:
                            </p>
                            <ul style={{ margin: '0', paddingLeft: '1.25rem', color: '#92400e', fontSize: '0.875rem' }}>
                                {contrastErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* 🔥 PREVIEW DE CORES */}
                <div style={{
                    padding: '1rem',
                    background: form.color_background,
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                }}>
                    <p style={{ fontSize: '0.75rem', color: form.color_text_muted, marginBottom: '0.5rem' }}>
                        Preview do tema atual
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: form.color_primary,
                            color: form.color_text,
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Primary
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: form.color_secondary,
                            color: form.color_text,
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Secondary
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: form.color_accent,
                            color: form.color_background,
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Accent
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: form.color_text,
                            color: form.color_background,
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Texto
                        </span>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: form.color_text_muted,
                            color: form.color_background,
                            borderRadius: '4px',
                            fontSize: '0.75rem'
                        }}>
                            Texto Sec.
                        </span>
                    </div>
                    <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem',
                        background: form.color_surface,
                        borderRadius: '4px',
                        border: `1px solid ${form.color_border || '#3D2318'}`
                    }}>
                        <p style={{ color: form.color_text, fontSize: '0.75rem', margin: 0 }}>
                            Card preview - {form.font_body}
                        </p>
                    </div>
                </div>

                {/* 🔥 CORES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                            Cores do Tema
                        </label>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Primária
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_primary"
                                value={form.color_primary}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_primary"
                                value={form.color_primary}
                                onChange={handleChange}
                                placeholder="#8B4513"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Secundária
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_secondary"
                                value={form.color_secondary}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_secondary"
                                value={form.color_secondary}
                                onChange={handleChange}
                                placeholder="#DAA520"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Destaque (Accent)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_accent"
                                value={form.color_accent}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_accent"
                                value={form.color_accent}
                                onChange={handleChange}
                                placeholder="#F5DEB3"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Fundo (Background)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_background"
                                value={form.color_background}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_background"
                                value={form.color_background}
                                onChange={handleChange}
                                placeholder="#1A0F0A"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Superfície (Cards)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_surface"
                                value={form.color_surface}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_surface"
                                value={form.color_surface}
                                onChange={handleChange}
                                placeholder="#2C1810"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Texto
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_text"
                                value={form.color_text}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_text"
                                value={form.color_text}
                                onChange={handleChange}
                                placeholder="#FFFFFF"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#64748b' }}>
                            Texto Secundário (Muted)
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="color"
                                name="color_text_muted"
                                value={form.color_text_muted}
                                onChange={handleChange}
                                style={{ width: '40px', height: '40px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
                            />
                            <Input
                                name="color_text_muted"
                                value={form.color_text_muted}
                                onChange={handleChange}
                                placeholder="#94A3B8"
                                style={{ flex: 1 }}
                            />
                        </div>
                    </div>
                </div>

                {/* 🔥 FONTES */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                            Fontes
                        </label>
                    </div>

                    <Select
                        label="Fonte dos Títulos"
                        name="font_heading"
                        value={form.font_heading}
                        onChange={handleChange}
                        options={FONT_OPTIONS}
                    />

                    <Select
                        label="Fonte do Corpo"
                        name="font_body"
                        value={form.font_body}
                        onChange={handleChange}
                        options={FONT_OPTIONS}
                    />

                    <Select
                        label="Fonte de Destaque"
                        name="font_accent"
                        value={form.font_accent}
                        onChange={handleChange}
                        options={FONT_OPTIONS}
                    />
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
        <Card title="Personalização do Site">
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