import { useForm } from 'react-hook-form'
import Button from '../../ui/Button.jsx'

function LoginForm({ isPending, onSubmit }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({ defaultValues: { email: '', password: '' } })

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <label className="block text-sm font-medium">
        Email
        <input
          type="email"
          autoComplete="email"
          autoFocus
          disabled={isPending}
          className="form-field"
          {...register('email', { required: 'Enter your email address.' })}
        />
        {errors.email && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.email.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          type="password"
          autoComplete="current-password"
          disabled={isPending}
          className="form-field"
          {...register('password', { required: 'Enter your password.' })}
        />
        {errors.password && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.password.message}</span>}
      </label>
      <Button type="submit" className="w-full" disabled={isPending}>{isPending ? 'Signing in...' : 'Sign in'}</Button>
    </form>
  )
}

export default LoginForm
