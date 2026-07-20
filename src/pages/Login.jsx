import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function Login(){


    const {
        login,
        profile
    } = useAuth();


    const navigate = useNavigate();



    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");



   async function handleSubmit(e){

    e.preventDefault();

    setError("");

    try{

        const result = await login(
            email,
            password
        );


        console.log(
            "LOGIN RESULT:",
            result
        );


        if(result.profile?.role === "super_admin"){

            navigate("/SuperAdminDashboard");

        }


        else if(result.profile?.role === "restaurant_admin"){

            navigate("/RestaurantAdminDashboard");

        }


    }
    catch(err){

        console.error(err);

        setError(
            "Email ou senha inválidos"
        );

    }

}



    return (

        <div style={{
            maxWidth:"400px",
            margin:"50px auto"
        }}>


            <h1>
                Menu Virtual QR
            </h1>


            <h2>
                Login
            </h2>


            {
                error &&
                <p style={{
                    color:"red"
                }}>
                    {error}
                </p>
            }


            <form onSubmit={handleSubmit}>


                <input
                    placeholder="Email"
                    value={email}
                    onChange={
                        e=>setEmail(e.target.value)
                    }
                />


                <br/>


                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={
                        e=>setPassword(e.target.value)
                    }
                />


                <br/>


                <button>
                    Entrar
                </button>


            </form>


        </div>

    )

}