import Spinner from '../../ui/Spinner.jsx'
import SettingsForm from './SettingsForm.jsx'
import { useGetSettings } from './useGetSettings.js'
import { useUpdateSettings } from './useUpdateSettings.js'

function SettingsContainer() {
  const { data: settings, error, isError, isLoading } = useGetSettings()
  const { isPending, updateSettings } = useUpdateSettings()

  if (isLoading) return <Spinner label="Loading settings" />

  if (isError) {
    return (
      <p className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
        {error.message || 'Unable to load settings.'}
      </p>
    )
  }

  return <SettingsForm settings={settings} isPending={isPending} onSubmit={updateSettings} />
}

export default SettingsContainer
