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

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // FIX: precisa ser uma ref, não uma variável local.
    // Uma variável local dentro do componente é recriada a cada
    // render, então o "cache" de chamada em andamento se perdia
    // entre renders diferentes e não evitava chamadas duplicadas.
    const profileRequestRef = useRef(null);

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
            }

            setLoading(false);
        }

        init();

        // FIX: getSession() acima já cobre a sessão inicial.
        // O onAuthStateChange também dispara um evento assim que é
        // registrado (INITIAL_SESSION), então sem o filtro abaixo
        // as duas chamadas competiam e podiam gerar refresh/profile
        // duplicados em paralelo — provável causa do 429.
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((event, session) => {

            if (!mounted) return;

            if (event === "INITIAL_SESSION") {
                // já tratado pelo init() acima, ignora
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

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };

    }, [loadProfile]);

    const login = useCallback(async (email, password) => {

        const { data, error } = await supabase.auth
            .signInWithPassword({ email, password });

        if (error) throw error;

        await loadProfile(data.user.id);

        return { user: data.user };

    }, [loadProfile]);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    }, []);

    // FIX: memoiza o value do provider. Sem isso, um objeto novo era
    // criado em TODO render do AuthProvider, forçando re-render de
    // qualquer componente que consome o contexto (ex: DashboardRouter
    // renderizando repetido nos seus logs).
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