import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "./pages/Login";

import SuperAdminDashboard 
from "./pages/SuperAdminDashboard";


import RestaurantAdminDashboard 
from "./pages/RestaurantAdminDashboard";


import ProtectedRoute 
from "./components/common/ProtectedRoute";



export default function AppRoutes(){


    return (

        <Routes>


            <Route 
                path="/login"
                element={<Login />}
            />



            <Route

                path="/super-admin"

                element={

                    <ProtectedRoute role="super_admin">

                        <SuperAdminDashboard />

                    </ProtectedRoute>

                }

            />



            <Route

                path="/restaurant-admin"

                element={

                    <ProtectedRoute role="restaurant_admin">

                        <RestaurantAdminDashboard />

                    </ProtectedRoute>

                }

            />



            <Route

                path="*"

                element={
                    <Navigate to="/login"/>
                }

            />


        </Routes>

    );

}