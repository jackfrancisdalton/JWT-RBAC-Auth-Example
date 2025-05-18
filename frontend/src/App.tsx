import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import UnauthenticatedPage from './auth/pages/UnauthenticatedPage'
import AuthenticatedPage from './auth/pages/AuthenticatedPage';
import PublicOnlyRoute from './auth/components/PublicOnlyRoute';
import ProtectedRoute from './auth/components/ProtectedRoute';
import AuthRedirect from './auth/components/AuthRedirect';
import { APP_PATHS } from './auth/resources/AppPaths';
import Header from './auth/components/Header';
import AdminPage from './auth/pages/AdminPage';

function App() {
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthRedirect 
          authenticatedRedirectUrl="/home"
          unauthenticatedRedirectUrl="/login"
        />
      ),
    },
    {
      path: APP_PATHS.LOGIN,
      element: (
        <PublicOnlyRoute>
          <UnauthenticatedPage />
        </PublicOnlyRoute>
      ),   
    },
    {
      path: APP_PATHS.HOME,
      element: (
        <ProtectedRoute requiredRoles={['user']}>
          <AuthenticatedPage />
        </ProtectedRoute>
      )
    },
    {
      path: APP_PATHS.ADMIN,
      element: (
        <ProtectedRoute requiredRoles={['admin']}>
          <AdminPage />
        </ProtectedRoute>
      )
    }
  ]);

  return (
    <div className="w-full h-screen relative">
      <Header></Header>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
