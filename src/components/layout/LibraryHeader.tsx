import { Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface LibraryHeaderProps {
  onMenuToggle: () => void
}

export default function LibraryHeader({ onMenuToggle }: LibraryHeaderProps) {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-accent/30 bg-primary shadow-lg">
      <div className="flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded p-2 transition-colors hover:bg-accent/20 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6 text-primary-foreground" />
        </button>

        <Link to="/" className="font-display tracking-wide text-primary-foreground">
          <span className="hidden text-3xl sm:inline lg:text-4xl">Librería Alejandría</span>
          <span className="text-2xl sm:hidden">L. Alejandría</span>
        </Link>

        <div
          className={`${searchOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-20 border-b border-accent/30 bg-primary px-4 py-3 md:static md:flex md:flex-1 md:max-w-md md:border-0 md:bg-transparent md:py-0 md:pl-0 md:pr-0 md:ml-auto`}
        >
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-accent" />
            <input
              type="text"
              placeholder="Buscar libros, autores..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="font-ui w-full rounded-sm border border-accent/30 bg-primary-foreground/10 py-2.5 pr-4 pl-11 text-primary-foreground placeholder:text-primary-foreground/60 transition-all focus:ring-2 focus:ring-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded p-2 transition-colors hover:bg-accent/20 md:hidden"
            aria-label="Buscar"
          >
            <Search className="h-6 w-6 text-primary-foreground" />
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="font-ui hidden rounded-sm px-3 py-2 text-sm text-primary-foreground/90 transition hover:bg-accent/20 sm:inline"
              >
                Mi cuenta
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="font-ui rounded-sm border border-accent/40 px-3 py-2 text-sm text-primary-foreground transition hover:bg-accent/20"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-ui hidden rounded-sm px-3 py-2 text-sm text-primary-foreground/90 transition hover:bg-accent/20 sm:inline"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="font-ui rounded-sm bg-primary-foreground/15 px-3 py-2 text-sm text-primary-foreground transition hover:bg-primary-foreground/25"
              >
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
