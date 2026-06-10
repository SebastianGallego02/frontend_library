import { useEffect, useState } from 'react'
import api from '../services/api'
import { loanService } from '../services/loan.service'
import type { Loan } from '../types/Loan'
import { getApiErrorMessage } from '../utils/apiError'

export default function AdminLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [returningLoanId, setReturningLoanId] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadLoans() {
      setLoading(true)
      setError('')

      try {
        const data = await loanService.getAdminAll()
        if (isMounted) {
          setLoans(
            data.map((loan) => ({
              ...loan,
              loanDate: loan.loanDate ?? (loan as any).LoanDate ?? '',
              dueDate: loan.dueDate ?? (loan as any).DueDate ?? '',
              isReturned:
                (loan as any).isReturned ??
                (loan as any).IsReturned ??
                false,
            })),
          )
        }
      } catch (err) {
        console.error('Error cargando préstamos de admin', err)
        setError(getApiErrorMessage(err, 'No se pudieron cargar los préstamos.'))
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadLoans()

    return () => {
      isMounted = false
    }
  }, [])

  const handleReturnLoan = async (loanId: number) => {
    setError('')
    setSuccessMessage(null)
    setReturningLoanId(loanId)

    try {
      // Realizamos la petición POST al endpoint correcto con el loanId en el body
      await api.post('/loans/return', { loanId })

      // Actualizamos el préstamo en la lista local para mostrar el estado "Devuelto"
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, isReturned: true } : loan
        ),
      )

      setSuccessMessage(`Préstamo #${loanId} devuelto correctamente.`)
      window.setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      console.error('Error devolviendo el libro', err)
      setError(getApiErrorMessage(err, 'No se pudo devolver el libro.'))
    } finally {
      setReturningLoanId(null)
    }
  }

  return (
    <section className="p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">Gestión de préstamos</h1>
        <p className="font-ui mt-2 text-sm text-muted-foreground">
          Consulta todos los préstamos de la biblioteca. Solo disponible para administradores.
        </p>
      </header>

      {error ? (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 rounded-sm border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-sm border border-border bg-card shadow-sm">
        <table className="font-ui w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-sidebar">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">ID préstamo</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">ID libro</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">ID usuario</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Fecha préstamo</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Fecha vencimiento</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando préstamos…
                </td>
              </tr>
            ) : loans.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No hay préstamos registrados.
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr key={loan.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-card-foreground">{loan.id}</td>
                  <td className="px-4 py-3 text-card-foreground">{loan.bookId}</td>
                  <td className="px-4 py-3 text-card-foreground">{loan.userId}</td>
                  <td className="px-4 py-3 text-card-foreground">
                    {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-card-foreground">
                    {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {loan.isReturned ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[.24em] text-emerald-700">
                        Devuelto
                      </span>
                    ) : (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[.24em] text-orange-700">
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {!loan.isReturned ? (
                      <button
                        type="button"
                        onClick={() => void handleReturnLoan(loan.id)}
                        disabled={returningLoanId === loan.id}
                        className="rounded-sm bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {returningLoanId === loan.id ? 'Devolviendo…' : 'Devolver libro'}
                      </button>
                    ) : (
                      <span className="text-muted-foreground text-xs">Sin acción</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
