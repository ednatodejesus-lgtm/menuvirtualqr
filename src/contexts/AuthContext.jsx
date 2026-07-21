import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    supabase,
    TABLES
} from "../services/supabase";


export const AuthContext = createContext();



export function AuthProvider({children}){


    const [user,setUser] = useState(null);

    const [profile,setProfile] = useState(null);

    const [loading,setLoading] = useState(true);



    async function loadProfile(userId){


        console.log(
            "BUSCANDO PROFILE:",
            userId
        );


        const {
            data,
            error
        }
        =
        await supabase
        .from(TABLES.PROFILES)
        .select("*")
        .eq("id",userId)
        .single();



        console.log(
            "PROFILE RESPONSE:",
            data,
            error
        );



        if(error){

            console.error(error);

            setProfile(null);

            return null;

        }



        setProfile(data);

        return data;

    }




    useEffect(()=>{


        let mounted=true;



        async function init(){


            const {
                data:{
                    session
                }
            }
            =
            await supabase.auth.getSession();



            if(session?.user && mounted){


                setUser(
                    session.user
                );


                await loadProfile(
                    session.user.id
                );

            }



            if(mounted){

                setLoading(false);

            }

        }



        init();



        const {
            data:{
                subscription
            }
        }
        =
        supabase.auth.onAuthStateChange(
            (event,session)=>{


                console.log(
                    "AUTH:",
                    event
                );


                if(!mounted)
                    return;



                if(session?.user){


                    setUser(
                        session.user
                    );


                    setTimeout(()=>{

                        loadProfile(
                            session.user.id
                        );

                    },0);


                }
                else{


                    setUser(null);

                    setProfile(null);

                }



            }
        );



        return ()=>{

            mounted=false;

            subscription.unsubscribe();

        };


    },[]);




    async function login(email,password){


        const {
            data,
            error
        }
        =
        await supabase.auth
        .signInWithPassword({

            email,
            password

        });



        if(error)
            throw error;



        return data.user;

    }




    async function logout(){

        await supabase.auth.signOut();

        setUser(null);

        setProfile(null);

    }



    return (

        <AuthContext.Provider

        value={{
            user,
            profile,
            loading,
            login,
            logout
        }}

        >

            {children}

        </AuthContext.Provider>

    );

}