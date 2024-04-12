import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        // Redirect to login page and save the current location
        return <Navigate to="/register" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
