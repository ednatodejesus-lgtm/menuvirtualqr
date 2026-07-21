import {
    useEffect,
    useState
} from "react";


import {
    supabase
} from "../../services/supabase";



export default function RestaurantList(){


    const [restaurants,setRestaurants] = useState([]);

    const [loading,setLoading] = useState(true);



    async function loadRestaurants(){


        try{


            setLoading(true);



            const {
                data,
                error

            } = await supabase

                .from("restaurants")

                .select(`
                    id,
                    name,
                    slug,
                    business_type,
                    style,
                    status,
                    theme,
                    description,
                    created_at
                `)

                .order(
                    "created_at",
                    {
                        ascending:false
                    }
                );




            if(error){

                throw error;

            }



            console.log(
                "RESTAURANTS:",
                data
            );



            setRestaurants(
                data || []
            );



        }
        catch(error){


            console.error(
                "LOAD RESTAURANTS ERROR:",
                error
            );


        }
        finally{


            setLoading(false);


        }


    }





    useEffect(()=>{


        loadRestaurants();


    },[]);







    if(loading){


        return (

            <section>

                <h2>

                    Carregando restaurantes...

                </h2>

            </section>

        );

    }






    return (

        <section

        style={{

            background:
            "var(--card)",

            padding:"30px",

            borderRadius:"16px",

            boxShadow:
            "var(--theme-shadow)"

        }}

        >



            <h2>

                Restaurantes

            </h2>



            {
                restaurants.length === 0 && (


                    <p>

                        Nenhum restaurante criado.

                    </p>


                )

            }







            <div

            style={{

                display:"grid",

                gap:"20px"

            }}

            >



            {
                restaurants.map(
                    restaurant => (


                    <article

                    key={
                        restaurant.id
                    }


                    style={{

                        border:
                        "1px solid rgba(0,0,0,.1)",


                        padding:"20px",


                        borderRadius:"12px"

                    }}

                    >




                        <h3>

                            {restaurant.name}

                        </h3>




                        <p>

                            Slug:
                            {" "}
                            {restaurant.slug}

                        </p>



                        <p>

                            Tipo:
                            {" "}
                            {restaurant.business_type}

                        </p>




                        <p>

                            Estilo:
                            {" "}
                            {restaurant.style}

                        </p>





                        <p>

                            Status:
                            {" "}
                            {restaurant.status}

                        </p>




                        <p>

                            Descrição:

                            <br/>

                            {restaurant.description || 
                            "Sem descrição"}

                        </p>





                        <p>

                            Tema IA:

                            {" "}

                            {
                            restaurant.theme &&
                            Object.keys(
                                restaurant.theme
                            ).length > 0

                            ?

                            "Gerado ✅"

                            :

                            "Sem tema"

                            }

                        </p>





                    </article>


                ))

            }



            </div>




        </section>

    );

}