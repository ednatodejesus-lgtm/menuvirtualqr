import { useAuth } from "../hooks/useAuth";

import SuperAdminDashboard 
from "../pages/SuperAdminDashboard";

import RestaurantAdminDashboard
from "../pages/RestaurantAdminDashboard";



export default function DashboardRouter(){


    const {
        profile,
        loading
    } = useAuth();



    if(loading){

        return (
            <h2>
                Carregando...
            </h2>
        );

    }



    if(!profile){

        return (
            <h2>
                Perfil não encontrado
            </h2>
        );

    }



    console.log(
        "DASHBOARD ROLE:",
        profile.role
    );



    if(profile.role === "super_admin"){

        return (
            <SuperAdminDashboard />
        );

    }



    if(profile.role === "restaurant_admin"){

        return (
            <RestaurantAdminDashboard />
        );

    }



    return (

        <h2>
            Permissão inválida
        </h2>

    );


}