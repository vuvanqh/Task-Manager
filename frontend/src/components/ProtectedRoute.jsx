import {Navigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({roles, children})
{
    const token = localStorage.getItem("token");
   
    if(!token) return <Navigate to="/login" replace/>;
    if(roles && roles.length>0)
    {
        try {
            const payload = jwtDecode(token);
            if(payload.exp && Date.now()/1000 > payload.exp){
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
                return <Navigate to="/login" replace/>;
            }
            if(!roles.includes(payload.role)) return <Navigate to="/projects" replace/>;
        }
        catch(e)
        {
            return <Navigate to="/login" replace/>;
        }
    }
    return children;
}