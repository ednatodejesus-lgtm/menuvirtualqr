import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


export default function ProtectedRoute({
    children,
    role
}){


    const {
        user,
        profile,
        loading
    } = useAuth();



    if(loading){

        return <div>
            Carregando...
        </div>;

    }



    if(!user){

        return <Navigate to="/login"/>

    }



    if(role && profile?.role !== role){

        return <Navigate to="/login"/>

    }



    return children;

}