import { Navigate } from 'react-router-dom'
import useUser from '../features/auth/useUser.js'
import Spinner from './Spinner.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useUser()

  if (isLoading) return <Spinner label="Checking session" />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
