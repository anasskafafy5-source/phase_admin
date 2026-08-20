import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateProduct } from '../../services/productsApi.js'
import { PRODUCTS_QUERY_KEY } from './useGetProducts.js'

export function useUpdateProduct(options = {}) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      toast.success('Product updated successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to update product:', error)
      toast.error("Can't update product right now. Please try again later.")
    },
  })

  return { ...mutation, updateProduct: mutation.mutate }
}
