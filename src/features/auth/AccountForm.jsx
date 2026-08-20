import { useForm } from 'react-hook-form'
import Button from '../../ui/Button.jsx'

function AccountForm({ isPending, onSubmit, user }) {
  const {
    formState: { errors, isDirty },
    getValues,
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: user.email || '',
      fullName: user.user_metadata?.fullName || '',
      password: '',
      passwordConfirm: '',
    },
  })

  function submitForm({ fullName, password }) {
    onSubmit({ fullName: fullName.trim(), password })
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="max-w-2xl rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="border-b border-[var(--color-border)] pb-5">
        <h2 className="text-lg font-semibold">Your account</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Manage your profile and password.</p>
      </div>
      <div className="mt-6 space-y-5">
        <label className="block text-sm font-medium">
          Email address
          <input type="email" disabled className="form-field cursor-not-allowed opacity-60" {...register('email')} />
          <span className="mt-1 block text-xs text-[var(--color-text-muted)]">Email address cannot be changed here.</span>
        </label>
        <label className="block text-sm font-medium">
          Name
          <input
            type="text"
            autoComplete="name"
            disabled={isPending}
            className="form-field"
            {...register('fullName', { required: 'Enter your name.' })}
          />
          {errors.fullName && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.fullName.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          New password <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
          <input
            type="password"
            autoComplete="new-password"
            disabled={isPending}
            className="form-field"
            {...register('password', {
              minLength: { value: 8, message: 'Use at least 8 characters.' },
            })}
          />
          {errors.password && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.password.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            disabled={isPending}
            className="form-field"
            {...register('passwordConfirm', {
              validate: (value) => !getValues('password') || value === getValues('password') || 'Passwords do not match.',
            })}
          />
          {errors.passwordConfirm && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.passwordConfirm.message}</span>}
        </label>
      </div>
      <div className="mt-7 flex justify-end border-t border-[var(--color-border)] pt-5">
        <Button type="submit" disabled={isPending || !isDirty}>{isPending ? 'Saving...' : 'Save changes'}</Button>
      </div>
    </form>
  )
}

export default AccountForm
