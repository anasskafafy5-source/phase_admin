import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { login } from '../../services/authApi.js'
import { USER_QUERY_KEY } from './authKeys.js'

export function useLogin(options = {}) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user)
      options.onSuccess?.(user)
    },
    onError: (error) => {
      console.error('Failed to sign in:', error)
      toast.error('Incorrect email or password. Please try again.')
    },
  })

  return { ...mutation, login: mutation.mutate }
}
