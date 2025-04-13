import './App.css'
import UnauthenticatedPage from './auth/pages/UnauthenticatedPage'
import { AuthProvider } from './auth/providers/AuthProvider'

function App() {
  return (
    <div>
      <AuthProvider>
        <UnauthenticatedPage></UnauthenticatedPage>
      </AuthProvider>
    </div>
  )
}

export default App
