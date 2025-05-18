import { PropsWithChildren } from 'react';
import { useAuth } from '../providers/AuthProvider';
import ThisIsBlockedPage from '../pages/ThisIsBlockedPage';
import { Navigate } from 'react-router-dom';
import { APP_PATHS } from '../resources/AppPaths';
import { UserRole } from '../types/auth.types';

type ProtectedRouteProps =  {
    requiredRoles: UserRole[]; 
} & PropsWithChildren;

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
    const { user } = useAuth();

    // User starts as undefined so we treat this as a loading state
    if (user === undefined) {
        return <div>Loading...</div>
    }

    // If user is not logged in redirect to login page
    if (!user) {
        return <Navigate to={APP_PATHS.LOGIN} replace />;
    }

    // If user is logged in but lacks permissions show the blocked page
    if (!requiredRoles.every(role => user.roles.includes(role))) {
        return <ThisIsBlockedPage requiredRoles={requiredRoles}></ThisIsBlockedPage>
    }

    return children;
};

export default ProtectedRoute;