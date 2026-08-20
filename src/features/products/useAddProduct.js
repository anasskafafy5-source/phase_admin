import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { addProduct } from '../../services/productsApi.js'
import { PRODUCTS_QUERY_KEY } from './useGetProducts.js'

export function useAddProduct(options = {}) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      toast.success('Product added successfully.')
      options.onSuccess?.(...args)
    },
    onError: (error) => {
      console.error('Failed to add product:', error)
      toast.error("Can't add product right now. Please try again later.")
    },
  })

  return { ...mutation, addProduct: mutation.mutate }
}
