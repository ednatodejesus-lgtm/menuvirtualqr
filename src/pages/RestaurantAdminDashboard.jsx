import { useAuth } from "../hooks/useAuth";


export default function RestaurantAdminDashboard(){

    const { profile, restaurants, logout } = useAuth();


    return (
        <div>

            <h1>
                Restaurant Admin Dashboard
            </h1>


            <p>
                Bem vindo:
                {" "}
                {profile?.full_name}
            </p>


            <p>
                Restaurante:
                {" "}
                {restaurants?.name}
            </p>


            <p>
                Role:
                {" "}
                {profile?.role}
            </p>


            <button onClick={logout}>
                Sair
            </button>


        </div>
    );

}