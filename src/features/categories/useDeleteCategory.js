import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteCategory } from '../../services/categoryApi.js'
import { CATEGORIES_QUERY_KEY } from './useGetCategories.js'

export function useDeleteCategory(options = {}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      toast.success('Category deleted successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to delete category:', error)
      toast.error("Can't delete category right now. Please try again later.")
    },
  })

  return { ...mutation, deleteCategory: mutation.mutate }
}
