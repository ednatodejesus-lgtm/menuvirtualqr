import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Login from "./pages/Login";

import DashboardRouter
from "./pages/DashboardRouter";


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
                path="/DashboardRouter"
                element={
                    <ProtectedRoute>
                        <DashboardRouter/>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );

}