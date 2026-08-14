import {
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";

import DashboardRouter
from "./pages/DashboardRouter";

import PublicMenu
from "./pages/PublicMenu";

import ProtectedRoute
from "./components/common/ProtectedRoute";


export default function AppRoutes() {

    return (
        <Routes>

            {/* LOGIN */}
            <Route
                path="/login"
                element={<Login />}
            />


            {/* DASHBOARD PROTEGIDO */}
            <Route
                path="/DashboardRouter"
                element={
                    <ProtectedRoute>
                        <DashboardRouter />
                    </ProtectedRoute>
                }
            />


            {/* MENU PÚBLICO */}
            <Route
                path="/menu/:slug"
                element={<PublicMenu />}
            />

        </Routes>
    );
}