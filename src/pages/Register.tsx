import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/common/AuthCard'
import FormField from '../components/common/FormField'
import { useAuth } from '../contexts/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

/**
 * Register page: POST /Auth/register via AuthContext.
 * On success the API returns a JWT; session is persisted and user goes to dashboard.
 */
export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
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
      await register({ email, userName, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Crear cuenta" subtitle="Únete a Librería Alejandría">
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
          label="Usuario"
          name="userName"
          type="text"
          autoComplete="username"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <FormField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="font-ui w-full rounded-sm bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creando cuenta…' : 'Registrarse'}
        </button>
      </form>

      <p className="font-ui mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
          Inicia sesión
        </Link>
      </p>
    </AuthCard>
  )
}
