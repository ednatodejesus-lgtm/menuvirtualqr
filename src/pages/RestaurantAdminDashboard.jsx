import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

import AdminCategories from "../components/admin/AdminCategories";
import AdminProducts from "../components/admin/AdminProducts";
import AdminQRCode from "../components/admin/AdminQRCode";
import AdminSettings from "../components/admin/AdminSettings";


import "../styles/admin.css";


export default function RestaurantAdminDashboard(){

    const { profile, restaurants, logout } = useAuth();


    const [activePage,setActivePage] = useState("dashboard");


    const renderPage = () => {

        switch(activePage){

            case "categories":
                return <AdminCategories />;


            case "products":
                return <AdminProducts />;


            case "qrcode":
                return <AdminQRCode />;


            case "settings":
                return <AdminSettings />;


            default:
                return (
                    <div className="admin-home">

                        <h2>
                            Dashboard
                        </h2>


                        <p>
                            Bem vindo ao painel do restaurante
                        </p>

                    </div>
                );

        }

    }



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