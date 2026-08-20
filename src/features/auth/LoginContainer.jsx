import { Navigate, useNavigate } from 'react-router-dom'
import Spinner from '../../ui/Spinner.jsx'
import LoginForm from './LoginForm.jsx'
import { useLogin } from './useLogin.js'
import useUser from './useUser.js'

function LoginContainer() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useUser()
  const { isPending, login } = useLogin({ onSuccess: () => navigate('/dashboard', { replace: true }) })

  if (isLoading) return <Spinner label="Checking session" />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-4">
      <section className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <p className="text-xl font-bold tracking-tight">PHASE</p>
          <h1 className="mt-5 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Sign in to manage your store.</p>
        </div>
        <LoginForm isPending={isPending} onSubmit={login} />
      </section>
    </main>
  )
}

export default LoginContainer
