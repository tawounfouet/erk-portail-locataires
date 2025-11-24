import { Navigate } from "react-router-dom";

export default function Redirector()
{
    return <Navigate 
        to="/login" 
        state={{ 
            from: location,
            message: "Veuillez vous connecter pour accéder à cette page"
        }} 
        replace 
    />
}