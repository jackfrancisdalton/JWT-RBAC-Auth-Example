import { PropsWithChildren } from 'react';
import { Role, useAuth } from '../providers/AuthProvider';
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

    if (!user || !requiredRoles.every(role => user.roles.includes(role))) {
        return <Navigate to="/" replace />;
        // Note: you could return a "you cannot access this page" component depending on desired app behaviour
    }

    return children;
};

export default ProtectedRoute;