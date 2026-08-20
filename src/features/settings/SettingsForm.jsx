import { useForm } from 'react-hook-form'
import { HiOutlineDevicePhoneMobile, HiOutlineLink } from 'react-icons/hi2'
import Button from '../../ui/Button.jsx'

function SettingsForm({ isPending, onSubmit, settings }) {
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      instagramUrl: settings.instagram_url || '',
      whatsappNumber: settings.whatsapp_number || '',
    },
  })

  function submitForm({ instagramUrl, whatsappNumber }) {
    onSubmit({ id: settings.id, instagramUrl: instagramUrl.trim(), whatsappNumber: whatsappNumber.trim() })
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--color-border)] pb-5">
        <h2 className="text-lg font-semibold">Store contact details</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Keep the storefront contact links up to date.</p>
      </div>
      <div className="mt-6 space-y-5">
        <label className="block text-sm font-medium">
          <span className="flex items-center gap-2"><HiOutlineDevicePhoneMobile className="size-5 text-[var(--color-text-muted)]" /> WhatsApp number</span>
          <input
            type="tel"
            autoComplete="tel"
            disabled={isPending}
            placeholder="01118109655"
            className="form-field"
            {...register('whatsappNumber', {
              required: 'Enter a WhatsApp number.',
              validate: (value) => /^[+\d][\d\s()-]{5,}$/.test(value.trim()) || 'Enter a valid phone number.',
            })}
          />
          {errors.whatsappNumber && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.whatsappNumber.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          <span className="flex items-center gap-2"><HiOutlineLink className="size-5 text-[var(--color-text-muted)]" /> Instagram URL</span>
          <input
            type="url"
            autoComplete="url"
            disabled={isPending}
            placeholder="https://www.instagram.com/your-account/"
            className="form-field"
            {...register('instagramUrl', {
              required: 'Enter an Instagram URL.',
              validate: (value) => {
                try {
                  const url = new URL(value)
                  return url.hostname.endsWith('instagram.com') || 'Enter a valid Instagram URL.'
                } catch {
                  return 'Enter a valid Instagram URL.'
                }
              },
            })}
          />
          {errors.instagramUrl && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.instagramUrl.message}</span>}
        </label>
      </div>
      <div className="mt-7 flex justify-end border-t border-[var(--color-border)] pt-5">
        <Button type="submit" disabled={isPending || !isDirty}>{isPending ? 'Saving...' : 'Save settings'}</Button>
      </div>
    </form>
  )
}

export default SettingsForm
