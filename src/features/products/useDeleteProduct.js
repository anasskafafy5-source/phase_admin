import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteProduct } from '../../services/productsApi.js'
import { PRODUCTS_QUERY_KEY } from './useGetProducts.js'

export function useDeleteProduct(options = {}) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      toast.success('Product deleted successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to delete product:', error)
      toast.error("Can't delete product right now. Please try again later.")
    },
  })

  return { ...mutation, deleteProduct: mutation.mutate }
}
