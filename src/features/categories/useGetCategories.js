import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../services/categoryApi.js'

export const CATEGORIES_QUERY_KEY = ['categories']

export function useGetCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategories,
  })
}
