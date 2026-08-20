import { useQuery } from '@tanstack/react-query'
import { getSettings } from '../../services/settingsApi.js'

export const SETTINGS_QUERY_KEY = ['settings']

export function useGetSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSettings,
  })
}
