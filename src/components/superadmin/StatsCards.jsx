import {
    useEffect,
    useState
} from "react";


import {
    supabase
} from "../../services/supabase";



export default function StatsCards(){


    const [stats,setStats]=useState({

        restaurants:0,

        active:0,

        suspended:0,

        admins:0

    });






    async function loadStats(){


        try{


            const {
                data:restaurants
            } = await supabase

            .from("restaurants")

            .select(
                "id,status"
            );





            const {
                data:admins

            } = await supabase

            .from("profiles")

            .select("id")

            .eq(
                "role",
                "restaurant_admin"
            );





            setStats({

                restaurants:
                restaurants?.length || 0,


                active:

                restaurants?.filter(

                    r=>r.status==="active"

                ).length || 0,



                suspended:

                restaurants?.filter(

                    r=>r.status==="suspended"

                ).length || 0,



                admins:

                admins?.length || 0

            });



        }

        catch(error){


            console.error(
                "STATS ERROR:",
                error
            );


        }


    }





    useEffect(()=>{


        loadStats();


    },[]);







    const cards=[

        {
            title:"Restaurantes",
            value:stats.restaurants
        },


        {
            title:"Activos",
            value:stats.active
        },


        {
            title:"Suspensos",
            value:stats.suspended
        },


        {
            title:"Administradores",
            value:stats.admins
        }


    ];





    return (

        <div className="stats-grid">


            {
                cards.map(card=>(


                    <div

                    className="stats-card"

                    key={
                        card.title
                    }

                    >


                        <h3>

                            {card.title}

                        </h3>


                        <strong>

                            {card.value}

                        </strong>



                    </div>


                ))

            }



        </div>

    );

}