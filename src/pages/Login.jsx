import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaGoogle } from "react-icons/fa";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    Store,
    Coffee,
    Pizza,
    Hotel,
    Flame,
    Smartphone,
    Utensils,
    Building2,
    Sparkles,
    KeyRound,
    AlertCircle,
    UserPlus
} from "lucide-react";

import RegisterModal from "../components/auth/RegisterModal";

export default function Login() {
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            navigate("/DashboardRouter");
        } catch (err) {
            console.error("LOGIN ERROR:", err);
            setError("Email ou senha inválidos");
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            await loginWithGoogle();
        } catch (err) {
            console.error("GOOGLE LOGIN ERROR:", err);
            setError("Erro ao fazer login com Google");
        }
    }

    function handleForgotPassword() {
        alert("Funcionalidade em desenvolvimento. Em breve poderá recuperar sua senha.");
    }

    // ============================================================
    // ICONES DOS NEGOCIOS
    // ============================================================
    const businessIcons = [
        { icon: Store, label: "Restaurante" },
        { icon: Coffee, label: "Café" },
        { icon: Pizza, label: "Pizzaria" },
        { icon: Hotel, label: "Hotel" },
        { icon: Flame, label: "Bar Noturno" },
        { icon: Utensils, label: "Fast Food" },
        { icon: Smartphone, label: "Loja Tech" },
        { icon: Building2, label: "Spa" },
    ];

    return (
        <>
            <div style={styles.container}>
                {/* Background com overlay */}
                <div style={styles.background}>
                    <div style={styles.backgroundOverlay} />
                    <div style={styles.businessGrid}>
                        {businessIcons.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} style={styles.businessIcon}>
                                    <Icon size={24} color="rgba(255,255,255,0.15)" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Card de Login */}
                <div style={styles.card}>
                    {/* Logo */}
                    <div style={styles.logoContainer}>
                        
                        <h1 style={styles.logoTitle}>
                            Menu<span style={{ color: '#DAA520' }}>QR</span>
                        </h1>
                        <p style={styles.logoSubtitle}>
                            Gestão de Menus Digitais
                        </p>
                    </div>

                    {/* Título */}
                    <div style={styles.header}>
                        <h2 style={styles.title}>Bem-vindo de volta</h2>
                        <p style={styles.subtitle}>
                            Entre na sua conta para gerir o seu negócio
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
                        <div style={styles.inputGroup}>
                            <div style={styles.inputIcon}>
                                <Mail size={18} color="#94a3b8" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <div style={styles.inputIcon}>
                                <Lock size={18} color="#94a3b8" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} color="#94a3b8" />
                                ) : (
                                    <Eye size={18} color="#94a3b8" />
                                )}
                            </button>
                        </div>

                        {/* Opções */}
                        <div style={styles.optionsRow}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={styles.checkbox}
                                />
                                Lembrar-me
                            </label>
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                style={styles.forgotButton}
                            >
                                <KeyRound size={14} />
                                Esqueci a senha
                            </button>
                        </div>

                        {/* Botão Entrar */}
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
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    Entrar
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        {/* 🔥 BOTÃO REGISTAR-SE */}
                    <div style={styles.registerRow}>
                        <p style={styles.registerText}>
                            Não tem uma conta?
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowRegister(true)}
                            style={styles.registerButton}
                        >
                            <UserPlus size={16} />
                            Registar-se
                        </button>
                    </div>


                    </form>

                    {/* Divisor */}
                    <div style={styles.divider}>
                        <span style={styles.dividerLine} />
                        <span style={styles.dividerText}>ou continue com</span>
                        <span style={styles.dividerLine} />
                    </div>

                    {/* Login com Google */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        style={styles.googleButton}
                        disabled={loading}
                    >
                        <FaGoogle size={20} />
                        Entrar com Google
                    </button>

                    

                    {/* Footer */}
                    <div style={styles.footer}>
                        <p style={styles.footerText}>
                            © 2026 Menu Virtual QR - Todos os direitos reservados
                        </p>
                        <div style={styles.footerBusiness}>
                            <Store size={14} color="#94a3b8" />
                            <span style={styles.footerBusinessText}>
                                Multi-negócio · Restaurante · Hotel · Café · Bar · Loja
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 MODAL DE REGISTO */}
            {showRegister && (
                <RegisterModal onClose={() => setShowRegister(false)} />
            )}
        </>
    );
}

// ============================================================
// ESTILOS
// ============================================================
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '1rem',
        backgroundColor: '#0f0f0f',
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
    },
    backgroundOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(26,15,10,0.85) 50%, rgba(15,15,15,0.9) 100%)',
    },
    businessGrid: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
        gap: '2rem',
        padding: '4rem',
        opacity: 0.3,
        pointerEvents: 'none',
    },
    businessIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.5,
    },
    card: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(20, 20, 20, 0.92)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
    },
    logoContainer: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    logoIcon: {
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
    logoTitle: {
        fontSize: '1.75rem',
        fontWeight: '800',
        color: '#FFFFFF',
        margin: '0',
        letterSpacing: '-0.5px',
    },
    logoSubtitle: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        margin: '0.25rem 0 0 0',
        letterSpacing: '0.5px',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#FFFFFF',
        margin: '0 0 0.25rem 0',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#94a3b8',
        margin: '0',
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
    eyeButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
    },
    optionsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.25rem',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
        cursor: 'pointer',
    },
    checkbox: {
        width: '16px',
        height: '16px',
        accentColor: '#8B4513',
        cursor: 'pointer',
    },
    forgotButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#94a3b8',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'color 0.2s',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
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
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '1.5rem 0',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    dividerText: {
        fontSize: '0.75rem',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.7rem',
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        color: '#FFFFFF',
        fontSize: '0.9rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    registerRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
    },
    registerText: {
        fontSize: '0.85rem',
        color: '#94a3b8',
        margin: 0,
    },
    registerButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.4rem 1rem',
        backgroundColor: 'rgba(218, 165, 32, 0.12)',
        color: '#DAA520',
        border: '1px solid rgba(218, 165, 32, 0.15)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    footer: {
        marginTop: '2rem',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '0.7rem',
        color: '#475569',
        margin: '0',
    },
    footerBusiness: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        marginTop: '0.5rem',
    },
    footerBusinessText: {
        fontSize: '0.65rem',
        color: '#475569',
        letterSpacing: '0.3px',
    },
};

// 🔥 Animação para o spinner
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