import { useQuery } from '@tanstack/react-query'
import { getProduct } from '../../services/productsApi.js'
import { PRODUCTS_QUERY_KEY } from './useGetProducts.js'

export function useGetProduct(productId) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, productId],
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
  })
}
