import './App.css'
import { useAuth } from './hooks/authHooks'

function App() {
  const isAuthenticated = useAuth();
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {isAuthenticated ? <h1>Welcome to the Dashboard!</h1> : <h1>Login!</h1>}
  </div>
  )
}

export default App
