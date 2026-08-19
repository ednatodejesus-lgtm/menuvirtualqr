import {
    useEffect,
    useState
} from "react";

import {
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaTiktok,
    FaGlobe,
    FaLink
} from 'react-icons/fa';

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

import {
    useAuth
} from "../../../hooks/useAuth";

import {
    getRestaurantSettings,
    updateRestaurantSettings
} from "../../../services/restaurantSettingsService";

export default function SocialSettings() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        whatsapp: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        website: ""
    });

    const restaurantId = profile?.restaurant_id;

    useEffect(() => {
        loadSocial();
    }, [restaurantId]);

    async function loadSocial() {
        if (!restaurantId) return;

        try {
            const data = await getRestaurantSettings(restaurantId);
            setForm({
                whatsapp: data.social_links?.whatsapp || "",
                facebook: data.social_links?.facebook || "",
                instagram: data.social_links?.instagram || "",
                tiktok: data.social_links?.tiktok || "",
                website: data.social_links?.website || ""
            });
        } catch (error) {
            console.error("Erro ao carregar redes sociais:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        if (success) setSuccess(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setSaving(true);
            setSuccess(false);
            await updateRestaurantSettings(restaurantId, {
                social_links: { ...form }
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error("Erro ao guardar redes sociais:", error);
            alert("Erro ao guardar alterações");
        } finally {
            setSaving(false);
        }
    }

    // 🔥 CONFIGURAÇÃO DOS CAMPOS COM CORES E ÍCONES
    const socialFields = [
        {
            name: 'whatsapp',
            label: 'WhatsApp',
            icon: FaWhatsapp,
            iconColor: '#25D366',
            bgColor: '#ecfdf5',
            borderColor: '#6ee7b7',
            placeholder: '+244 9XX XXX XXX',
            description: 'Número com código do país',
            example: 'Ex: +244 9XX XXX XXX'
        },
        {
            name: 'facebook',
            label: 'Facebook',
            icon: FaFacebook,
            iconColor: '#1877F2',
            bgColor: '#eff6ff',
            borderColor: '#93c5fd',
            placeholder: 'https://facebook.com/sua-pagina',
            description: 'URL da sua página',
            example: 'Ex: https://facebook.com/meurestaurante'
        },
        {
            name: 'instagram',
            label: 'Instagram',
            icon: FaInstagram,
            iconColor: '#E4405F',
            bgColor: '#fdf2f8',
            borderColor: '#f9a8d4',
            placeholder: 'https://instagram.com/seu-perfil',
            description: 'URL do seu perfil',
            example: 'Ex: https://instagram.com/meurestaurante'
        },
        {
            name: 'tiktok',
            label: 'TikTok',
            icon: FaTiktok,
            iconColor: '#000000',
            bgColor: '#f3f4f6',
            borderColor: '#d1d5db',
            placeholder: 'https://tiktok.com/@seu-perfil',
            description: 'URL do seu perfil',
            example: 'Ex: https://tiktok.com/@meurestaurante'
        },
        {
            name: 'website',
            label: 'Website',
            icon: FaGlobe,
            iconColor: '#6B7280',
            bgColor: '#f9fafb',
            borderColor: '#d1d5db',
            placeholder: 'https://seusite.com',
            description: 'URL do seu site oficial',
            example: 'Ex: https://meurestaurante.com'
        }
    ];

    if (loading) {
        return (
            <Card title="Redes Sociais">
                <p style={{ color: '#64748b' }}>Carregando redes sociais...</p>
            </Card>
        );
    }

    return (
        <Card title="Redes Sociais">
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ 
                    color: '#64748b', 
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                }}>
                    Configure os links das suas redes sociais para aparecerem no menu público.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {socialFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.name} style={{
                                padding: '1rem',
                                borderRadius: '8px',
                                backgroundColor: field.bgColor,
                                border: `1px solid ${field.borderColor}`,
                                transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <Icon size={20} color={field.iconColor} />
                                    <label style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#334155'
                                    }}>
                                        {field.label}
                                    </label>
                                </div>
                                <Input
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                <small style={{
                                    color: '#94a3b8',
                                    fontSize: '0.7rem',
                                    display: 'block',
                                    marginTop: '0.25rem'
                                }}>
                                    {field.example}
                                </small>
                            </div>
                        );
                    })}
                </div>

                {success && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '8px',
                        border: '1px solid #86efac',
                        fontSize: '0.875rem'
                    }}>
                        Redes sociais atualizadas com sucesso!
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
                        'Guardando...'
                    ) : (
                        <>
                            <FaLink size={16} />
                            Guardar Redes Sociais
                        </>
                    )}
                </Button>
            </form>
        </Card>
    );
}