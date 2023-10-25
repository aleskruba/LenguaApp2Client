import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const RequireAdminAuth = () => {
  
  const { user } = useAuth();


  return user.admin ? <Outlet /> : <Navigate to="/" replace />;
};
