import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateSettings } from '../../services/settingsApi.js'
import { SETTINGS_QUERY_KEY } from './useGetSettings.js'

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
      toast.success('Settings updated successfully.')
    },
    onError: (error) => {
      console.error('Failed to update settings:', error)
      toast.error("Can't update settings right now. Please try again later.")
    },
  })

  return { ...mutation, updateSettings: mutation.mutate }
}
