import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/common/AuthCard'
import FormField from '../components/common/FormField'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

/**
 * Login page: POST /Auth/login via AuthContext.
 * On success the JWT is stored in localStorage and the user is sent to /dashboard.
 */
export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Login failed. Please check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Iniciar sesión" subtitle="Accede a tu cuenta en la biblioteca">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-sm border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
          >
            {error}
          </div>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="font-ui w-full rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="font-ui mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary/80">
          Regístrate
        </Link>
      </p>
    </AuthCard>
  )
}
