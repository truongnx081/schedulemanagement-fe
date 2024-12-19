// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserScope } from '../utils/authUtils.ts';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/dang-nhap" />;
    }

    const userRole = getUserScope();

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
