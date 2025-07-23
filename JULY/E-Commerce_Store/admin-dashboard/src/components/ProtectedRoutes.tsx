import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes(){
    const login = Boolean(true);
    return login ? <Outlet/> : <Navigate to="/"/>
}