import { useState } from "react";
import {
    X,
    Mail,
    User,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle,
    AlertCircle,
    Sparkles,
    UserPlus,
    Store,
    Phone,
    Globe,
    ImagePlus,
    Upload,
    Building2,
    MapPin,
    Lock
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "../../services/supabase";

export default function RegisterModal({ onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [createdData, setCreatedData] = useState(null);

    const [form, setForm] = useState({
        // Dados do Restaurante
        name: "",
        business_type: "restaurant",
        style: "modern",
        description: "",
        logo_url: "",

        // Contactos
        contact_phone: "",
        contact_email: "",
        address: "",

        // Redes Sociais
        facebook: "",
        instagram: "",
        whatsapp: "",
        website: "",
        tiktok: "",

        // Administrador
        admin_name: "",
        admin_email: "",
    });

    const businessTypes = [
        { value: "restaurant", label: "Restaurante" },
        { value: "cafeteria", label: "Cafeteria" },
        { value: "pizzaria", label: "Pizzaria" },
        { value: "humbergeria", label: "Hamburgueria" },
        { value: "bar_noturno", label: "Bar Noturno" },
        { value: "hotel", label: "Hotel" },
        { value: "hospedaria", label: "Hospedaria" },
        { value: "spa", label: "Spa" },
        { value: "loja_tech", label: "Loja de Tecnologia" },
        { value: "loja_roupa", label: "Loja de Roupa" },
        { value: "boutique", label: "Boutique" },
        { value: "farmacia", label: "Farmácia" },
        { value: "stand_automovel", label: "Stand Automóvel" },
        { value: "resort", label: "Resort" },
        { value: "outros", label: "Outros" },
    ];

    const styleOptions = [
        { value: "modern", label: "Moderno" },
        { value: "classic", label: "Clássico" },
        { value: "luxury", label: "Luxo" },
        { value: "minimal", label: "Minimalista" },
    ];

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError("");
    }

    function handleLogo(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("Por favor, selecione uma imagem válida.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 2MB.");
            return;
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    }

    async function uploadLogo() {
        if (!logoFile) return null;

        const extension = logoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${extension}`;

        const { error } = await supabase.storage
            .from("logos")
            .upload(fileName, logoFile);

        if (error) throw error;

        const { data } = supabase.storage
            .from("logos")
            .getPublicUrl(fileName);

        return data.publicUrl;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // ============================================================
        // VALIDAÇÕES
        // ============================================================
        if (!form.name.trim()) {
            setError("Nome do restaurante é obrigatório");
            return;
        }

        if (!form.admin_name.trim()) {
            setError("Nome do administrador é obrigatório");
            return;
        }

        if (!form.admin_email.trim()) {
            setError("Email do administrador é obrigatório");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // ============================================================
            // 1. FAZER UPLOAD DO LOGO (SE EXISTIR)
            // ============================================================
            let logo_url = null;
            if (logoFile) {
                logo_url = await uploadLogo();
            }

            // ============================================================
            // 3. CHAMAR A EDGE FUNCTION create-restaurant
            // ============================================================
            const payload = {
                name: form.name,
                logo_url,
                contact_phone: form.contact_phone,
                contact_email: form.contact_email,
                address: form.address,
                business_type: form.business_type,
                style: form.style,
                description: form.description,
                social_links: {
                    facebook: form.facebook,
                    instagram: form.instagram,
                    whatsapp: form.whatsapp,
                    website: form.website,
                    tiktok: form.tiktok,
                },
                admin_name: form.admin_name,
                admin_email: form.admin_email,
            };

            console.log("Enviando payload:", payload);

            const response = await supabase.functions.invoke(
                "create-restaurant",
                {
                    body: payload,
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (response.error) {
                const errorBody = await response.error.context.json();
                console.error("❌ EDGE FUNCTION ERROR:", errorBody);
                throw new Error(errorBody.error || "Erro ao criar restaurante");
            }

            console.log("✅ Resposta da Edge Function:", response.data);

            setCreatedData(response.data);
            setSuccess(true);

            

        } catch (err) {
            
            setError(err.message || "Erro ao registar. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // ============================================================
    // RENDERIZAR
    // ============================================================
    if (success && createdData) {
        return (
            <SuccessModal
                data={createdData}
                onClose={onClose}
            />
        );
    }

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Botão Fechar */}
                <button style={styles.closeButton} onClick={onClose}>
                    <X size={22} />
                </button>

                {/* Cabeçalho */}
                <div style={styles.header}>
                    <h1 style={styles.logoTitle}>
                            Menu<span style={{ color: '#DAA520' }}>QR</span>
                        </h1>
                    <h2 style={styles.title}>Criar Restaurante</h2>
                    <p style={styles.subtitle}>
                        Preencha os dados para criar o seu menu digital
                    </p>
                </div>

                {/* Erro */}
                {error && (
                    <div style={styles.errorBox}>
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* ============================================================
                        SECÇÃO 1: DADOS DO RESTAURANTE
                        ============================================================ */}
                    <div style={styles.sectionTitle}>
                        <Store size={18} color="#DAA520" />
                        <span>Dados do Restaurante</span>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <Building2 size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome do restaurante *"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <div style={styles.inputIcon}>
                                <Store size={18} color="#94a3b8" />
                            </div>
                            <select
                                name="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    appearance: 'auto',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    color: '#FFFFFF'
                                }}
                                disabled={loading}
                            >
                                {businessTypes.map((type) => (
                                    <option key={type.value} value={type.value} style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF' }}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <div style={styles.inputIcon}>
                                <Sparkles size={18} color="#94a3b8" />
                            </div>
                            <select
                                name="style"
                                value={form.style}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    appearance: 'auto',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    color: '#FFFFFF'
                                }}
                                disabled={loading}
                            >
                                {styleOptions.map((style) => (
                                    <option key={style.value} value={style.value} style={{ backgroundColor: '#1a1a1a', color: '#FFFFFF' }}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <MapPin size={18} color="#94a3b8" />
                        </div>
                        <textarea
                            name="description"
                            placeholder="Descrição do negócio"
                            value={form.description}
                            onChange={handleChange}
                            style={{ ...styles.input, minHeight: '60px', resize: 'vertical', fontFamily: 'inherit' }}
                            disabled={loading}
                        />
                    </div>

                    {/* ============================================================
                        SECÇÃO 2: LOGO
                        ============================================================ */}
                    <div style={styles.sectionTitle}>
                        <ImagePlus size={18} color="#DAA520" />
                        <span>Logo</span>
                    </div>

                    <label style={styles.uploadBox}>
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo"
                                style={styles.logoPreview}
                            />
                        ) : (
                            <>
                                <Upload size={35} color="#64748b" />
                                <span style={styles.uploadText}>Selecionar logo</span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogo}
                            style={styles.fileInput}
                            disabled={loading}
                        />
                    </label>

                    {/* ============================================================
                        SECÇÃO 3: CONTACTOS
                        ============================================================ */}
                    <div style={styles.sectionTitle}>
                        <Phone size={18} color="#DAA520" />
                        <span>Contactos</span>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <Phone size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="text"
                            name="contact_phone"
                            placeholder="Telefone"
                            value={form.contact_phone}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <Mail size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="email"
                            name="contact_email"
                            placeholder="Email do restaurante"
                            value={form.contact_email}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <MapPin size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="text"
                            name="address"
                            placeholder="Endereço"
                            value={form.address}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    {/* ============================================================
                        SECÇÃO 4: REDES SOCIAIS
                        ============================================================ */}
                    <div style={styles.sectionTitle}>
                        <Globe size={18} color="#DAA520" />
                        <span>Redes Sociais</span>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <span style={{ fontSize: '14px' }}></span>
                        </div>
                        <input
                            type="text"
                            name="facebook"
                            placeholder="Facebook"
                            value={form.facebook}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <span style={{ fontSize: '14px' }}></span>
                        </div>
                        <input
                            type="text"
                            name="instagram"
                            placeholder="Instagram"
                            value={form.instagram}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <span style={{ fontSize: '14px' }}></span>
                        </div>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="WhatsApp"
                            value={form.whatsapp}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <span style={{ fontSize: '14px' }}></span>
                        </div>
                        <input
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={form.website}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <span style={{ fontSize: '14px' }}></span>
                        </div>
                        <input
                            type="text"
                            name="tiktok"
                            placeholder="TikTok"
                            value={form.tiktok}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    {/* ============================================================
                        SECÇÃO 5: ADMINISTRADOR
                        ============================================================ */}
                    <div style={styles.sectionTitle}>
                        <User size={18} color="#DAA520" />
                        <span>Administrador</span>
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <User size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="text"
                            name="admin_name"
                            placeholder="Nome do administrador *"
                            value={form.admin_name}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.inputIcon}>
                            <Mail size={18} color="#94a3b8" />
                        </div>
                        <input
                            type="email"
                            name="admin_email"
                            placeholder="Email do administrador *"
                            value={form.admin_email}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div style={styles.infoBox}>
                        <Lock size={16} color="#DAA520" />
                        <span style={styles.infoText}>
                            A senha será gerada automaticamente e enviada no próximo passo.
                        </span>
                    </div>

                    {/* Botão Criar */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            ...(loading ? styles.submitButtonDisabled : {})
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                A criar...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Criar Restaurante
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div style={styles.modalFooter}>
                    <p style={styles.modalFooterText}>
                        Ao criar uma conta, concorda com os
                        <a href="#" style={styles.modalFooterLink}> Termos de Serviço</a>
                        {" e "}
                        <a href="#" style={styles.modalFooterLink}>Política de Privacidade</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// COMPONENTE DE SUCESSO
// ============================================================
function SuccessModal({ data, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!data) return null;

    const restaurant = data.restaurant;
    const admin = data.admin;
    const qr = data.qr;

    const copyData = async () => {
        const text = `
Menu Virtual QR

Restaurante: ${restaurant.name}

Gerente:
Email: ${admin.email}
Password: ${admin.password}

Link do Menu: ${qr.link}
`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.successModal} onClick={(e) => e.stopPropagation()}>
                {/* Botão Fechar */}
                <button style={styles.closeButton} onClick={onClose}>
                    <X size={22} />
                </button>

                <div style={styles.successHeader}>
                    <div style={styles.successIcon}>
                        <CheckCircle size={35} color="#22c55e" />
                    </div>
                    <h2 style={styles.successTitle}>Restaurante criado com sucesso!</h2>
                    <p style={styles.successSubtitle}>
                        ⚠️ Guarde as credenciais do gerente. Elas não serão mostradas novamente.
                    </p>
                </div>

                <div style={styles.successContent}>
                    {/* Restaurante */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>Restaurante</h3>
                        <strong style={styles.infoValue}>{restaurant.name}</strong>
                    </div>

                    {/* Gerente */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>Gerente</h3>
                        <p style={styles.infoText}>{admin.email}</p>
                    </div>

                    {/* Password */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>Password</h3>
                        <div style={styles.passwordBox}>
                            <span style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>
                                {showPassword ? admin.password : "••••••••••••"}
                            </span>
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.passwordToggle}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} color="#94a3b8" />
                                ) : (
                                    <Eye size={18} color="#94a3b8" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* URL Pública */}
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoTitle}>URL Pública</h3>
                        <a
                            href={qr.link}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.link}
                        >
                            {qr.link}
                        </a>
                    </div>

                    {/* QR Code */}
                    <div style={styles.qrContainer}>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr.link)}`}
                            alt="QR Code"
                            width="200"
                            height="200"
                        />
                    </div>

                    {/* ⚠️ Aviso importante */}
                    <div style={styles.warningBox}>
                        <AlertCircle size={18} color="#f59e0b" />
                        <span style={styles.warningText}>
                            Guarde estas informações antes de fechar. Não poderá ver a password novamente.
                        </span>
                    </div>
                </div>

                <div style={styles.modalActions}>
                    <button
                        onClick={copyData}
                        style={styles.primaryAction}
                    >
                        {copied ? (
                            <>
                                <CheckCircle size={16} />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '16px' }}>📋</span>
                                Copiar dados
                            </>
                        )}
                    </button>
                    <a
                        href={qr.link}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.secondaryAction}
                    >
                        <span style={{ fontSize: '16px' }}>🔗</span>
                        Abrir restaurante
                    </a>
                    <button
                        onClick={onClose}
                        style={{
                            ...styles.secondaryAction,
                            backgroundColor: '#8B4513',
                            color: '#FFFFFF',
                            border: '1px solid #8B4513',
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>✅</span>
                        Fechar (já guardei)
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
    },
    modal: {
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(20, 20, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
    },
    successModal: {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: 'rgba(20, 20, 20, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
    },
    closeButton: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#94a3b8',
        cursor: 'pointer',
        padding: '0.25rem',
        transition: 'color 0.2s',
        borderRadius: '4px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    iconContainer: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        background: 'rgba(218, 165, 32, 0.1)',
        borderRadius: '16px',
        marginBottom: '0.75rem',
        border: '1px solid rgba(218, 165, 32, 0.15)',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#FFFFFF',
        margin: '0',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: '0.25rem 0 0 0',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '10px',
        color: '#f87171',
        fontSize: '0.875rem',
        marginBottom: '1.5rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#DAA520',
        marginTop: '0.5rem',
        paddingTop: '0.5rem',
        borderTop: '1px solid rgba(218, 165, 32, 0.1)',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        transition: 'all 0.2s',
    },
    inputIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 0 0 1rem',
        flexShrink: 0,
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '0.9rem',
        color: '#FFFFFF',
        fontFamily: 'inherit',
    },
    uploadBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        border: '2px dashed rgba(255,255,255,0.1)',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minHeight: '120px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        position: 'relative',
    },
    logoPreview: {
        maxWidth: '120px',
        maxHeight: '80px',
        objectFit: 'contain',
        borderRadius: '8px',
    },
    uploadText: {
        fontSize: '0.8rem',
        color: '#64748b',
        marginTop: '0.5rem',
    },
    fileInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
    },
    infoBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(218, 165, 32, 0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(218, 165, 32, 0.1)',
    },
    infoText: {
        fontSize: '0.8rem',
        color: '#94a3b8',
    },
    submitButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        backgroundColor: '#8B4513',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '0.5rem',
    },
    submitButtonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    modalFooter: {
        marginTop: '1.5rem',
        textAlign: 'center',
    },
    modalFooterText: {
        fontSize: '0.7rem',
        color: '#475569',
        margin: 0,
        lineHeight: '1.6',
    },
    modalFooterLink: {
        color: '#DAA520',
        textDecoration: 'none',
    },

    // Success Modal Styles
    successHeader: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    successIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '50%',
        marginBottom: '0.75rem',
    },
    successTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#FFFFFF',
        margin: '0',
    },
    successSubtitle: {
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: '0.25rem 0 0 0',
    },
    successContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    infoCard: {
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    infoTitle: {
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#94a3b8',
        margin: '0 0 0.25rem 0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    infoValue: {
        fontSize: '1rem',
        color: '#FFFFFF',
    },
    infoText: {
        fontSize: '0.9rem',
        color: '#FFFFFF',
        margin: '0',
    },
    passwordBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.08)',
    },
    passwordToggle: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '0.25rem',
    },
    link: {
        color: '#DAA520',
        textDecoration: 'none',
        fontSize: '0.8rem',
        wordBreak: 'break-all',
    },
    qrContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    modalActions: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '1.5rem',
        flexWrap: 'wrap',
    },
    primaryAction: {
        flex: 1,
        padding: '0.6rem 1rem',
        backgroundColor: '#8B4513',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background 0.2s',
        minWidth: '100px',
    },
    secondaryAction: {
        flex: 1,
        padding: '0.6rem 1rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: '#94a3b8',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textDecoration: 'none',
        textAlign: 'center',
        minWidth: '100px',
    },

    // Adicionar no objeto styles
    warningBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '10px',
    marginTop: '0.5rem',
    },
    warningText: {
    fontSize: '0.8rem',
    color: '#fbbf24',
    lineHeight: '1.4',
    },
};

//  Animação para o spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 0.8s linear infinite;
    }
`;
document.head.appendChild(styleSheet);