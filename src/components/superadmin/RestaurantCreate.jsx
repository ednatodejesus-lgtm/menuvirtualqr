import { useState } from "react";
import { supabase } from "../../services/supabase";
import "./../../styles/superadmin.css";

export default function RestaurantCreate({onCreated}){


    const [open,setOpen] = useState(false);

    const [loading,setLoading] = useState(false);

    const [result,setResult] = useState(null);


    const [form,setForm] = useState({

        name:"",

        business_type:"restaurant",

        style:"modern",

        description:"",

        contact_phone:"",

        contact_email:"",

        address:"",

        admin_email:"",

        admin_name:""

    });





    function handleChange(e){


        setForm({

            ...form,

            [e.target.name]:
            e.target.value

        });


    }





    async function handleSubmit(e){


        e.preventDefault();


        try{


            setLoading(true);


            setResult(null);



            const {
                data,
                error

            } = await supabase.functions.invoke(

                "create-restaurant",

                {
                    body:form
                }

            );




            if(error){

                throw error;

            }



            console.log(
                "RESTAURANTE CRIADO:",
                data
            );



            setResult(data);



            if(onCreated){

                onCreated(data);

            }



        }
        catch(error){


            console.error(
                "CREATE RESTAURANT ERROR:",
                error
            );


            alert(
                error.message
            );


        }
        finally{

            setLoading(false);

        }


    }





    return (

        <section>


            {!open && (

                <button

                    onClick={()=>setOpen(true)}

                    style={{

                        padding:"14px 20px",

                        border:"none",

                        borderRadius:"10px",

                        background:
                        "var(--primary)",

                        color:"#fff",

                        cursor:"pointer",

                        fontWeight:"700"

                    }}

                >

                    + Criar Restaurante

                </button>

            )}







            {open && (


            <div

                style={{

                    background:"var(--card)",

                    padding:"30px",

                    borderRadius:"16px",

                    marginTop:"20px",

                    boxShadow:
                    "var(--theme-shadow)"

                }}

            >


                <h2>

                    Novo Restaurante

                </h2>




                <form

                    onSubmit={handleSubmit}

                    style={{

                        display:"grid",

                        gap:"15px"

                    }}

                >



                    <input

                        name="name"

                        placeholder="Nome"

                        onChange={handleChange}

                    />



                    <select

                        name="business_type"

                        onChange={handleChange}

                    >

                        <option value="restaurant">

                            Restaurante

                        </option>


                        <option value="bar_noturno">

                            Bar Noturno

                        </option>


                        <option value="hotel">

                            Hotel

                        </option>


                        <option value="spa">

                            Spa

                        </option>


                    </select>





                    <select

                        name="style"

                        onChange={handleChange}

                    >

                        <option value="modern">

                            Moderno

                        </option>


                        <option value="luxury">

                            Luxo

                        </option>


                        <option value="traditional">

                            Tradicional

                        </option>


                    </select>





                    <textarea

                        name="description"

                        placeholder="Descrição do conceito"

                        rows="4"

                        onChange={handleChange}

                    />





                    <input

                        name="admin_name"

                        placeholder="Nome do administrador"

                        onChange={handleChange}

                    />





                    <input

                        name="admin_email"

                        placeholder="Email administrador"

                        onChange={handleChange}

                    />





                    <input

                        name="contact_phone"

                        placeholder="Telefone"

                        onChange={handleChange}

                    />





                    <input

                        name="address"

                        placeholder="Morada"

                        onChange={handleChange}

                    />






                    <div

                    style={{

                        display:"flex",

                        gap:"10px"

                    }}

                    >


                    <button

                        disabled={loading}

                        style={{

                            padding:"12px",

                            background:
                            "var(--primary)",

                            color:"#fff",

                            border:"none",

                            borderRadius:"8px"

                        }}

                    >

                        {
                        loading
                        ?
                        "Criando..."
                        :
                        "Criar"
                        }
                       criar Restaurante
                    </button>





                    <button

                        type="button"

                        onClick={()=>setOpen(false)}

                    >

                        Cancelar

                    </button>


                    </div>



                </form>




                {result && (

                    <div

                    style={{

                        marginTop:"20px",

                        padding:"15px",

                        borderRadius:"10px",

                        background:"#eee"

                    }}

                    >

                        <h3>

                            Restaurante criado 🎉

                        </h3>


                        <p>

                        Login:
                        {" "}
                        {result.admin.email}

                        </p>


                        <p>

                        Senha:
                        {" "}
                        {result.admin.password}

                        </p>


                    </div>

                )}



            </div>


            )}



        </section>

    );

}