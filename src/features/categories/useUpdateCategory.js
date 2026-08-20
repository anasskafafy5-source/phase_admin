import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateCategory } from '../../services/categoryApi.js'
import { CATEGORIES_QUERY_KEY } from './useGetCategories.js'

export function useUpdateCategory(options = {}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      toast.success('Category updated successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to update category:', error)
      toast.error("Can't update category right now. Please try again later.")
    },
  })

  return { ...mutation, updateCategory: mutation.mutate }
}
