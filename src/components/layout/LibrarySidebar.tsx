import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ADMIN_LINKS, CATEGORIES } from '../../data/featuredBooks'
import { useAuth } from '../../contexts/AuthContext'

interface LibrarySidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

export default function LibrarySidebar({ mobileOpen, onClose }: LibrarySidebarProps) {
  const { isAuthenticated, isAdmin } = useAuth()
  const [adminVisible, setAdminVisible] = useState(true)

  const content = (
    <div className="space-y-8 p-6">
      <nav>
        <h2 className="font-display mb-4 tracking-wide text-sidebar-foreground opacity-90">
          Categorías
        </h2>
        <ul className="space-y-2">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <a
                href="#"
                onClick={onClose}
                className="font-ui group relative block rounded-sm px-3 py-2 text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-primary"
              >
                <span className="relative z-10">{category}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {isAuthenticated && isAdmin && adminVisible && (
        <div className="border-t border-sidebar-border pt-6">
          <h2 className="font-display mb-4 tracking-wide text-sidebar-primary">Panel de Administración</h2>
          <ul className="space-y-2">
            {ADMIN_LINKS.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/') ? (
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="font-ui block rounded-sm border border-transparent px-3 py-2 text-sidebar-primary/70 transition-all hover:border-sidebar-primary/20 hover:bg-primary/10 hover:text-sidebar-primary"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="font-ui block rounded-sm border border-transparent px-3 py-2 text-sidebar-primary/70 transition-all hover:border-sidebar-primary/20 hover:bg-primary/10 hover:text-sidebar-primary"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="font-ui block rounded-sm border border-transparent px-3 py-2 text-sidebar-primary/70 transition-all hover:border-sidebar-primary/20 hover:bg-primary/10 hover:text-sidebar-primary"
              >
                Mi perfil
              </Link>
            </li>
          </ul>
        </div>
      )}

      {isAuthenticated && isAdmin && (
        <div className="border-t border-sidebar-border pt-6">
          <button
            type="button"
            onClick={() => setAdminVisible((v) => !v)}
            className="font-ui w-full rounded-sm bg-accent/20 px-3 py-2 text-sm text-accent-foreground transition-colors hover:bg-accent/30"
          >
            {adminVisible ? 'Ocultar Panel Admin' : 'Mostrar Panel Admin'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar lg:block xl:w-72">
        {content}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="Cerrar menú"
            onClick={onClose}
          />
          <aside className="relative z-50 h-full w-72 max-w-[85vw] overflow-y-auto border-r border-sidebar-border bg-sidebar shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
