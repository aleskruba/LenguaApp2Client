// RequireAuth.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const RequireAuth = () => {
  
  const { user } = useAuth();


  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
