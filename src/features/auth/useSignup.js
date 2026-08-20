import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { signup } from '../../services/authApi.js'

export function useSignup(options = {}) {
  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: (...args) => {
      toast.success('User account created successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to create user:', error)
      toast.error("Can't create user right now. Please try again later.")
    },
  })

  return { ...mutation, signup: mutation.mutate }
}
