import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateAccount } from '../../services/authApi.js'
import { USER_QUERY_KEY } from './authKeys.js'

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user)
      toast.success('Account updated successfully.')
    },
    onError: (error) => {
      console.error('Failed to update account:', error)
      toast.error("Can't update account right now. Please try again later.")
    },
  })

  return { ...mutation, updateAccount: mutation.mutate }
}
