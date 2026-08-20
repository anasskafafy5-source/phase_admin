import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '../../services/dashboardApi.js'

export const DASHBOARD_STATS_QUERY_KEY = ['dashboard', 'stats']

export function useGetDashboardStats() {
  return useQuery({
    queryKey: DASHBOARD_STATS_QUERY_KEY,
    queryFn: getDashboardStats,
  })
}
