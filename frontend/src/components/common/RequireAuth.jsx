import React, { useContext } from 'react';
import { AuthContext } from '../context/Auth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RequireAuth = () => {

    const { user } = useContext(AuthContext);
    const location = useLocation();

    if (!user) {
        return <Navigate to={`/account/login`} />
    }

    // if (!user) {
    //     return <Navigate to={`/account/login?redirect=${location.pathname}`} replace />;
    // }

    return <Outlet />;
}