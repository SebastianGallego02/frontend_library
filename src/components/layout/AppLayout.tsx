import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import LibraryHeader from './LibraryHeader'
import LibrarySidebar from './LibrarySidebar'

/** Shell principal: header + sidebar + contenido (diseño Librería Alejandría) */
export default function AppLayout() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <Link to="/" className="font-display text-center text-4xl tracking-wide text-primary">
            Librería Alejandría
          </Link>
          <div className="mt-8 w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <LibraryHeader onMenuToggle={() => setMobileMenuOpen(true)} />
      <div className="flex">
        <LibrarySidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
