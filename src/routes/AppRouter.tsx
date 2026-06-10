import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../components/route/ProtectedRoute'
import Books from '../pages/Books'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminLoans from '../pages/AdminLoans'
import AdminSanctions from '../pages/AdminSanctions'
import AdminRoute from '../components/route/AdminRoute'

/**
 * Application routing:
 * - Public: /login, /register
 * - Protected (JWT required): /dashboard, /books via ProtectedRoute
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route element={<AdminRoute />}>
              <Route path="admin/loans" element={<AdminLoans />} />
              <Route path="admin/sanctions" element={<AdminSanctions />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
