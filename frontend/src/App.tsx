import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import UnauthenticatedPage from './auth/pages/UnauthenticatedPage'
import AuthenticatedPage from './auth/pages/AuthenticatedPage';

function App() {
  
  // TODO: set up router so we navigate/re-route based on authentication state
  const router = createBrowserRouter([
    {
      path: '/',
      element: <UnauthenticatedPage />,   
    },
    {
      path: '/home',
      element: <AuthenticatedPage />
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
