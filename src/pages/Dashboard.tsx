import { useAuth } from '../contexts/AuthContext'

/**
 * Panel de usuario autenticado (ruta protegida).
 * Muestra el perfil restaurado desde AuthContext / localStorage.
 */
export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="font-display mb-2 tracking-wide text-foreground">Mi cuenta</h2>
      <p className="font-ui mb-8 text-muted-foreground">
        Sesión activa. El JWT se adjunta automáticamente a las peticiones API.
      </p>

      <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm bg-sidebar p-4">
            <dt className="font-ui text-xs font-medium tracking-wide text-muted-foreground uppercase">
              ID de usuario
            </dt>
            <dd className="mt-1 font-mono text-sm text-card-foreground">{user.id}</dd>
          </div>
          <div className="rounded-sm bg-sidebar p-4">
            <dt className="font-ui text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Usuario
            </dt>
            <dd className="mt-1 text-sm text-card-foreground">{user.userName}</dd>
          </div>
          <div className="rounded-sm bg-sidebar p-4 sm:col-span-2">
            <dt className="font-ui text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Correo
            </dt>
            <dd className="mt-1 text-sm text-card-foreground">{user.email}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
