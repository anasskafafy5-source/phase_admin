import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addCategory } from '../../services/categoryApi.js'
import { CATEGORIES_QUERY_KEY } from './useGetCategories.js'

export function useAddCategory(options = {}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addCategory,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      toast.success('Category added successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to add category:', error)
      toast.error("Can't add category right now. Please try again later.")
    },
  })

  return { ...mutation, addCategory: mutation.mutate }
}
