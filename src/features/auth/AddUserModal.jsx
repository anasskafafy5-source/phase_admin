import { useForm } from 'react-hook-form'
import Button from '../../ui/Button.jsx'

function AddUserModal({ isPending, onClose, onSubmit }) {
  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
  } = useForm({ defaultValues: { email: '', name: '', password: '', passwordConfirm: '' } })

  return (
    <form className="space-y-5 p-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b border-[var(--color-border)] pb-4">
        <h2 className="text-lg font-semibold">Add user</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Create an account for another dashboard user.</p>
      </div>
      <label className="block text-sm font-medium">
        Name
        <input type="text" autoFocus disabled={isPending} className="form-field" {...register('name', { required: 'Enter a name.' })} />
        {errors.name && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.name.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Email
        <input type="email" autoComplete="email" disabled={isPending} className="form-field" {...register('email', { required: 'Enter an email address.' })} />
        {errors.email && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.email.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Password
        <input type="password" autoComplete="new-password" disabled={isPending} className="form-field" {...register('password', {
          minLength: { value: 8, message: 'Use at least 8 characters.' },
          required: 'Enter a password.',
        })} />
        {errors.password && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.password.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Confirm password
        <input type="password" autoComplete="new-password" disabled={isPending} className="form-field" {...register('passwordConfirm', {
          required: 'Confirm the password.',
          validate: (value) => value === getValues('password') || 'Passwords do not match.',
        })} />
        {errors.passwordConfirm && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.passwordConfirm.message}</span>}
      </label>
      <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button type="button" variant="secondary" disabled={isPending} onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Adding...' : 'Add user'}</Button>
      </div>
    </form>
  )
}

export default AddUserModal
