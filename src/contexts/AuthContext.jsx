import {
    createContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo
} from "react";

import {
    supabase,
    TABLES
} from "../services/supabase";

export const AuthContext = createContext();

// Renovamos a sessão a cada 25 minutos. O JWT do Supabase por padrão
// dura 60 minutos, então 25 min dá margem de sobra — sem nunca
// comparar com o expires_at do token, só um intervalo fixo.
const REFRESH_INTERVAL_MS = 25 * 60 * 1000;

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cache pra evitar chamadas simultâneas ao profile.
    // Precisa ser ref (não variável local) pra sobreviver entre renders.
    const profileRequestRef = useRef(null);

    // Guarda quando FOMOS NÓS que renovamos a sessão pela última vez.
    // Isso só compara o relógio local consigo mesmo (deltas), nunca
    // com um timestamp vindo do servidor — por isso não sofre com
    // relógio de usuário desconfigurado.
    const lastManualRefreshRef = useRef(0);
    const refreshIntervalRef = useRef(null);

    const loadProfile = useCallback(async (userId) => {

        if (!userId) return null;

        if (profileRequestRef.current) {
            return profileRequestRef.current;
        }

        profileRequestRef.current = supabase
            .from(TABLES.PROFILES)
            .select("*")
            .eq("id", userId)
            .single()
            .then(({ data, error }) => {

                if (error) {
                    console.error("PROFILE ERROR:", error);
                    setProfile(null);
                    return null;
                }

                setProfile(data);
                return data;

            })
            .finally(() => {
                profileRequestRef.current = null;
            });

        return profileRequestRef.current;

    }, []);

    // Renovação manual, sob nosso controle total. Não olha expires_at,
    // não olha o relógio de ninguém além do nosso próprio timer.
    const refreshSessionSafely = useCallback(async () => {
        try {
            const { error } = await supabase.auth.refreshSession();
            if (error) {
                console.error("Erro ao renovar sessão:", error);
                return;
            }
            lastManualRefreshRef.current = Date.now();
        } catch (err) {
            console.error("Erro ao renovar sessão:", err);
        }
    }, []);

    useEffect(() => {

        let mounted = true;

        async function init() {

            const {
                data: { session }
            } = await supabase.auth.getSession();

            if (!mounted) return;

            if (session?.user) {
                setUser(session.user);
                await loadProfile(session.user.id);
                lastManualRefreshRef.current = Date.now();
            }

            setLoading(false);
        }

        init();

        // autoRefreshToken está desligado no client (services/supabase.js).
        // onAuthStateChange agora só reage a eventos que NÓS geramos
        // (login, logout, refresh manual via setInterval/foco de aba) —
        // não sofre mais rajada por comparação de relógio.
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {

            if (!mounted) return;

            if (event === "INITIAL_SESSION") {
                return;
            }

            if (session?.user) {
                setUser(session.user);
                loadProfile(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
            }
        });

        // Timer fixo de renovação — não depende de expires_at.
        refreshIntervalRef.current = setInterval(() => {
            refreshSessionSafely();
        }, REFRESH_INTERVAL_MS);

        // Ao voltar para a aba, renova se fazia tempo que não renovávamos.
        // Compara só com nosso próprio último refresh (delta local),
        // nunca com um timestamp de servidor.
        function handleVisibilityChange() {
            if (document.visibilityState !== "visible") return;

            const elapsed = Date.now() - lastManualRefreshRef.current;
            if (elapsed > REFRESH_INTERVAL_MS) {
                refreshSessionSafely();
            }
        }

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearInterval(refreshIntervalRef.current);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };

    }, [loadProfile, refreshSessionSafely]);

    const login = useCallback(async (email, password) => {

        const { data, error } = await supabase.auth
            .signInWithPassword({ email, password });

        if (error) throw error;

        await loadProfile(data.user.id);
        lastManualRefreshRef.current = Date.now();

        return { user: data.user };

    }, [loadProfile]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }, []);

    // Memoiza o value pra não recriar objeto a cada render e evitar
    // re-render em cascata de quem consome o contexto.
    const value = useMemo(() => ({
        user,
        profile,
        loading,
        login,
        logout
    }), [user, profile, loading, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
