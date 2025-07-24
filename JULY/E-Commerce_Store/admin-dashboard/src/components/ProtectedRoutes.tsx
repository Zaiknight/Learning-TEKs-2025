import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "./cookieUsage";

export default function ProtectedRoutes() {
  
  const token = getCookie("token");
  const isLoggedIn = Boolean(token);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
}