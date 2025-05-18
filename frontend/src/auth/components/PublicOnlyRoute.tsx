import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

import { ReactNode } from 'react';
import { APP_PATHS } from '../resources/AppPaths';

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    // If the user is already authenticated, redirect to the home page
    return <Navigate to={APP_PATHS.HOME} replace />;
  }

  return children;
};

export default PublicOnlyRoute;