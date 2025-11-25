import React, { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate, Outlet } from "react-router-dom";

export const CheckAuth = () => {
    const { user } = useContext(AuthContext);

    if (user) {
        return <Navigate to="/account/dashboard" replace />;
    }

    return <Outlet />;
};
