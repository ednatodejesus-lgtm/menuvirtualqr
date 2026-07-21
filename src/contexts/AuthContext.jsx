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



    // evita chamadas simultâneas ao profile
    let profileRequest = null;



    async function loadProfile(userId){


        if(!userId)
            return null;



        if(profileRequest){

            return profileRequest;

        }



        profileRequest =
        supabase
        .from(TABLES.PROFILES)
        .select("*")
        .eq("id",userId)
        .single()
        .then(({data,error})=>{


            console.log(
                "PROFILE RESPONSE:",
                data,
                error
            );



            if(error){

                console.error(
                    "PROFILE ERROR:",
                    error
                );


                setProfile(null);

                return null;

            }



            setProfile(data);


            return data;


        })
        .finally(()=>{

            profileRequest=null;

        });



        console.log(
            "BUSCANDO PROFILE:",
            userId
        );



        return profileRequest;

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



            if(!mounted)
                return;



            if(session?.user){


                setUser(
                    session.user
                );


                await loadProfile(
                    session.user.id
                );


            }



            setLoading(false);


        }



        init();





        const {
            data:{
                subscription
            }
        }
        =
        supabase.auth.onAuthStateChange(
            (
                event,
                session
            )=>{


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



                    // não bloqueia o listener
                    loadProfile(
                        session.user.id
                    );


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







    async function login(
        email,
        password
    ){


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



        await loadProfile(
            data.user.id
        );



        return {

            user:data.user

        };


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