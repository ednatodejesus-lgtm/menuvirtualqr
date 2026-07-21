import {
    useState
} from "react";


import {
    useAuth
} from "../hooks/useAuth";


import DashboardHeader
from "../components/superadmin/DashboardHeader";


import StatsCards
from "../components/superadmin/StatsCards";


import RestaurantCreate
from "../components/superadmin/RestaurantCreate";


import RestaurantList
from "../components/superadmin/RestaurantList";


import "../styles/superadmin.css";



export default function SuperAdminDashboard(){


    const {
        profile,
        logout
    } = useAuth();



    // controla abertura e fecho do formulário
    const [
        showCreate,
        setShowCreate
    ] = useState(false);





    return (


        <div className="super-dashboard">



            <DashboardHeader

               profile={profile}

                onCreateRestaurant={()=>
                setShowCreate(true)
                }

/>





            <StatsCards/>





            {
                showCreate && (

                    <RestaurantCreate

                        onClose={()=>
                            setShowCreate(false)
                        }

                    />

                )
            }





            <RestaurantList/>





            <button

                onClick={logout}

            >

                Sair

            </button>




        </div>


    );

}