import { PropsWithChildren } from 'react';
import { Role, useAuth } from '../providers/AuthProvider';
import ThisIsBlockedPage from '../pages/ThisIsBlockedPage';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps =  {
    requiredRoles: Role[]; 
} & PropsWithChildren;

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const { user } = useAuth();

    // User starts as undefined so we treat this as a loading state
    if (user === undefined) {
        return <div>Loading...</div> // TODO: replace with a loading component
    }

    // If user is not logged in redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user is logged in but lacks permissions show lock page
    if (!requiredRoles.every(role => user.roles.includes(role))) {
        return <ThisIsBlockedPage requiredRoles={requiredRoles}></ThisIsBlockedPage>
    }

    // else render the children
    return children;
};

export default ProtectedRoute;