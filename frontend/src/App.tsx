import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import UnauthenticatedPage from './auth/pages/UnauthenticatedPage'
import AuthenticatedPage from './auth/pages/AuthenticatedPage';
import PublicOnlyRoute from './auth/components/PublicOnlyRoute';
import ProtectedRoute from './auth/components/ProtectedRoute';
import AuthRedirect from './auth/components/AuthRedirect';

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
      path: '/login',
      element: (
        <PublicOnlyRoute>
          <UnauthenticatedPage />
        </PublicOnlyRoute>
      ),   
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute requiredRoles={['user']}>
          <AuthenticatedPage />
        </ProtectedRoute>
      )
    },
    {
      path: '/admin',
      element: (
        <ProtectedRoute requiredRoles={['admin']}>
          <AuthenticatedPage />
        </ProtectedRoute>
      )
    }
  ]);

  return (
    <div>
      <h1>App</h1>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
