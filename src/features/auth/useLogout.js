import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { logout } from '../../services/authApi.js'
import { USER_QUERY_KEY } from './authKeys.js'

export function useLogout(options = {}) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: USER_QUERY_KEY })
      toast.success('Signed out successfully.')
      options.onSuccess?.()
    },
    onError: (error) => {
      console.error('Failed to sign out:', error)
      toast.error("Can't sign out right now. Please try again.")
    },
  })

  return { ...mutation, logout: mutation.mutate }
}
