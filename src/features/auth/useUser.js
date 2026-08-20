import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../../services/authApi.js'
import { USER_QUERY_KEY } from './authKeys.js'

function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getCurrentUser,
    retry: false,
  })

  return { isAuthenticated: Boolean(user), isLoading, user }
}

export default useUser
