import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface AuthRedirectProps {
    authenticatedRedirectUrl: string;
    unauthenticatedRedirectUrl: string;
}

export default function AuthRedirect({ authenticatedRedirectUrl, unauthenticatedRedirectUrl }: AuthRedirectProps) {
    const { user } = useAuth();

    return user 
        ? (<Navigate to={authenticatedRedirectUrl} replace />) 
        : (<Navigate to={unauthenticatedRedirectUrl} replace />);
}