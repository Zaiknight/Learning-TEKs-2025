import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes(){
    const login = Boolean(JSON.parse(sessionStorage.getItem("login")));
    return login ? <Outlet/> : <Navigate to="/"/>
}