import { useEffect, useState } from "react";


import {
    Store,
    FolderOpen,
    Package,
    QrCode,
    Utensils,
    Eye,
    Clock,
    CheckCircle
} from "lucide-react";



import { useAuth } from "../hooks/useAuth";


import {
    getDashboardStats,
    getRecentActivities,
    subscribeDashboardChanges
} from "../services/restaurantDashboardService";

import { supabase } from "../services/supabase";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import AdminCategories from "../components/admin/AdminCategories";
import AdminProducts from "../components/admin/AdminProducts";
import AdminQRCode from "../components/admin/AdminQRCode";
import AdminSettings from "../components/admin/AdminSettings";



import "../styles/admin.css";




export default function RestaurantAdminDashboard(){



    const {

        profile,

        restaurants,

        logout

    } = useAuth();


    const [restaurant,setRestaurant] = useState(null);


    const [activePage,setActivePage] = useState(
        "dashboard"
    );




    const [stats,setStats] = useState({

        categoriesCount:0,

        productsCount:0,

        qrCode:null

    });





    const [activities,setActivities] = useState([]);





    const [loading,setLoading] = useState(true);







    const restaurantId =
        profile?.restaurant_id;









    async function loadDashboard(){


        if(!restaurantId)
            return;




        try{


            setLoading(true);



            const [

                dashboardStats,

                recentActivities


            ] = await Promise.all([



                getDashboardStats(
                    restaurantId
                ),



                getRecentActivities(
                    restaurantId
                )


            ]);





            setStats(
                dashboardStats
            );




            setActivities(
                recentActivities
            );



        }

        catch(error){


            console.error(
                "Dashboard error:",
                error
            );


        }

        finally{


            setLoading(false);


        }


    }




      //* novo useEffect

      useEffect(()=>{


    async function loadRestaurant(){


        if(!profile?.restaurant_id)
            return;



        const {

            data,

            error

        } = await supabase


            .from("restaurants")


            .select(
                `
                id,
                name,
                business_type,
                status,
                logo_url
                `
            )


            .eq(
                "id",
                profile.restaurant_id
            )


            .single();




        if(error){

            console.error(
                "Erro ao buscar restaurante:",
                error
            );

            return;

        }




        setRestaurant(data);



    }



    loadRestaurant();



},[profile]);   //fechar






    useEffect(()=>{


        loadDashboard();



        const unsubscribe =

            subscribeDashboardChanges(

                restaurantId,

                ()=>{

                    loadDashboard();

                }

            );




        return ()=>{


            if(unsubscribe)

                unsubscribe();


        };



    },[restaurantId]);










    const renderPage = ()=>{



        switch(activePage){



            case "categories":

                return <AdminCategories/>;



            case "products":

                return <AdminProducts/>;



            case "qrcode":

                return <AdminQRCode/>;



            case "settings":

                return <AdminSettings/>;






            default:



            return (



            <div className="restaurant-cockpit">





                <section className="cockpit-welcome">



                    <div className="restaurant-title">


                        <Store size={34}/>



                        <div>


                           <h1>
{
    restaurant?.name || "Empresa"
}
</h1>


<p>

{
    restaurant?.business_type
}

{" "}

·

{" "}

<span className="status-active">

{
    restaurant?.status === "active"
    ?
    "Ativo"
    :
    "Suspenso"
}

</span>

</p>
                        </div>


                    </div>





                    <p>

                    Bem-vindo de volta,

                    {" "}

                    <strong>

                    {profile?.full_name}

                    </strong>

                    .

                    Aqui está o resumo do seu restaurante.

                    </p>



                </section>









                <section className="cockpit-stats">







                    <div className="status-card">


                        <FolderOpen/>


                        <div>

                            <span>

                            Categorias

                            </span>


                            <strong>

                            {
                                stats.categoriesCount
                            }

                            </strong>


                        </div>


                    </div>









                    <div className="status-card">


                        <Package/>


                        <div>

                            <span>

                            Produtos

                            </span>


                            <strong>

                            {
                                stats.productsCount
                            }

                            </strong>


                        </div>


                    </div>









                    <div className="status-card">


                        <QrCode/>


                        <div>

                            <span>

                            QR Code

                            </span>



                            <strong>

                            {

                            stats.qrCode?.ativo

                            ?

                            "Ativo"

                            :

                            "Inativo"

                            }

                            </strong>


                        </div>


                    </div>









                    <div className="status-card">


                        <Utensils/>


                        <div>

                            <span>

                            Menu

                            </span>


                            <strong>

                            {

                            stats.productsCount > 0

                            ?

                            "Publicado"

                            :

                            "Vazio"

                            }

                            </strong>


                        </div>


                    </div>









                    <div className="status-card">


                        <Eye/>


                        <div>

                            <span>

                            Acessos

                            </span>


                            <strong>

                            {

                            stats.qrCode?.acessos

                            ||

                            0

                            }


                            </strong>


                        </div>


                    </div>





                </section>









                <section className="activity-panel">



                    <div className="activity-header">


                        <h2>

                        Últimas atividades

                        </h2>


                    </div>






                    {

                    loading

                    ?

                    <p>

                    Carregando atividades...

                    </p>



                    :



                    <div className="activity-list">


                    {

                    activities.length === 0

                    ?


                    <p>

                    Ainda não existem atividades.

                    </p>



                    :



                    activities.map(activity=>(


                        <div

                        className="activity-item"

                        key={

                            activity.type +

                            activity.date

                        }


                        >



                            <div className="activity-icon">


                                <Clock size={18}/>


                            </div>





                            <div>


                                <strong>

                                {
                                    activity.text
                                }

                                </strong>



                                <p>

                                {
                                    new Date(
                                        activity.date
                                    )
                                    .toLocaleString(
                                        "pt-PT"
                                    )
                                }

                                </p>



                            </div>



                        </div>


                    ))



                    }


                    </div>


                    }




                </section>






            </div>



            );



        }


    };








    return (


        <div className="admin-layout">



            <AdminSidebar

                activePage={activePage}

                setActivePage={setActivePage}

            />




            <main className="admin-content">



                <AdminHeader

                    profile={profile}

                    restaurant={restaurants}

                    logout={logout}

                />




                {renderPage()}




            </main>



        </div>



    );


}