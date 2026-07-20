import { createContext, useEffect, useState } from "react";
import { supabase, TABLES } from "../services/supabase";


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
        } = await supabase
            .from(TABLES.PROFILES)
            .select("*")
            .eq("id", userId)
            .maybeSingle();



        if(error){

            console.error(
                "PROFILE ERROR:",
                error
            );

            return null;

        }


        console.log(
    "PROFILE RESPONSE:",
    {
        data,
        error
    }
);


        setProfile(data);


        return data;

    }




    useEffect(()=>{


        let mounted = true;



        async function start(){


            const {
                data:{
                    session
                }
            } = await supabase.auth.getSession();

            const {
                 data,
                 error
                  } = await supabase

            if(session?.user && mounted){


                setUser(session.user);


                await loadProfile(
                    session.user.id
                );


            }


            if(mounted){

                setLoading(false);

            }


        }



        start();



        const {
            data:{
                subscription
            }
        } = supabase.auth.onAuthStateChange(
            async(
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


                    await loadProfile(
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
        } = await supabase.auth.signInWithPassword({

            email,

            password

        });



        if(error)
            throw error;



        const profileData =
            await loadProfile(
                data.user.id
            );



        return {

            user:data.user,

            profile:profileData

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