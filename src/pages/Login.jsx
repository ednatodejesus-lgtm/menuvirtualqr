import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function Login(){

    const { login } = useAuth();

    const navigate = useNavigate();


    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);



    async function handleSubmit(e){

        e.preventDefault();

        setError("");
        setLoading(true);


        try{

            await login(
                email,
                password
            );


            // agora o login não decide nada
            navigate("/DashboardRouter");


        }catch(err){

            console.error(
                "LOGIN ERROR:",
                err
            );


            setError(
                "Email ou senha inválidos"
            );

        }
        finally{

            setLoading(false);

        }

    }



    return (

        <div
            style={{
                maxWidth:"400px",
                margin:"50px auto"
            }}
        >

            <h1>
                Menu Virtual QR
            </h1>


            <h2>
                Login
            </h2>


            {
                error &&
                <p style={{color:"red"}}>
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


                <br/><br/>


                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={
                        e=>setPassword(e.target.value)
                    }
                />


                <br/><br/>


                <button disabled={loading}>

                    {
                        loading
                        ?
                        "Entrando..."
                        :
                        "Entrar"
                    }

                </button>


            </form>


        </div>

    );

}