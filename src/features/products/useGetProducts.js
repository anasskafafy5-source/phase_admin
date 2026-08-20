import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getProducts } from '../../services/productsApi.js'

export const PRODUCTS_QUERY_KEY = ['products']

export function useGetProducts(params) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })
}
