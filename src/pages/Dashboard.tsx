import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { bookService } from '../services/book.service' // Importamos bookService
import { getApiErrorMessage } from '../utils/apiError'
import type { Loan } from '../types/Loan' // Assuming Loan type is defined here
import type { Book } from '../types/Book' // Assuming Book type is defined here


/**
 * Panel de usuario autenticado (ruta protegida).
 * Muestra el perfil restaurado desde AuthContext / localStorage.
 */
export default function Dashboard() {
  const { user } = useAuth()
  const [userLoans, setUserLoans] = useState<Loan[]>([])
  const [loadingLoans, setLoadingLoans] = useState(true)
  const [renewingLoanId, setRenewingLoanId] = useState<number | null>(null)
  const [renewError, setRenewError] = useState<string | null>(null)
  const [renewSuccessMessage, setRenewSuccessMessage] = useState<string | null>(null)
  const [loansError, setLoansError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMyLoans() {
      if (!user) {
        setLoadingLoans(false)
        return 
      }

      setLoadingLoans(true)
      setLoansError('')

      try {
        // Petición al endpoint de préstamos
        const loansResponse = await api.get<Loan[]>('/loans')
        const rawLoans = Array.isArray(loansResponse.data)
          ? loansResponse.data
          : (loansResponse.data as any).items ?? []

        // Filtramos solo los préstamos que pertenecen al usuario actual
        const myLoans = rawLoans.filter((loan: any) => loan.userId === user.id)

        // Para cada préstamo, obtenemos los detalles del libro
        const loansWithBookDetails = await Promise.all(
          myLoans.map(async (loan: any) => {
            let bookTitle = `Libro #${loan.bookId ?? loan.BookId}`
            let bookAuthor = 'Desconocido'
            try {
              const bookResponse = await bookService.getById(loan.bookId ?? loan.BookId)
              bookTitle = bookResponse.title
              bookAuthor = bookResponse.author
            } catch (bookErr) {
              console.warn(`No se pudieron cargar los detalles del libro ${loan.bookId}`, bookErr)
            }

            return {
              ...loan,
              // Aseguramos compatibilidad con el esquema de la base de datos
              loanDate: loan.loanDate ?? loan.LoanDate,
              dueDate: loan.dueDate ?? loan.DueDate,
              isReturned: loan.isReturned ?? loan.IsReturned ?? false,
              isExtended: loan.isExtended ?? loan.IsExtended ?? false,
              bookTitle,
              bookAuthor,
            }
          }),
        )

        if (isMounted) {
          setUserLoans(loansWithBookDetails.filter((loan) => !loan.isReturned)) // Solo préstamos activos
        }
      } catch (err) {
        console.error('Error cargando préstamos del usuario', err)
        setLoansError(getApiErrorMessage(err, 'No se pudieron cargar tus préstamos.'))
      } finally {
        if (isMounted) {
          setLoadingLoans(false)
        }
      }
    }

    void loadMyLoans()

    return () => {
      isMounted = false
    }
  }, [user]) // Re-run when user changes (e.g., after login)

  const handleRenewLoan = async (loanId: number) => {
    setRenewError(null)
    setRenewSuccessMessage(null)
    setRenewingLoanId(loanId)

    try {
      // La ruta es http://localhost:8080/api/loans/{id}/renew
      await api.post(`/loans/${loanId}/renew`)

      // Actualizamos el préstamo en la lista local para mostrar el estado "Extendido"
      setUserLoans((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, isExtended: true } : loan,
        ),
      )

      setRenewSuccessMessage(`Préstamo #${loanId} extendido correctamente.`)
      window.setTimeout(() => setRenewSuccessMessage(null), 4000)
    } catch (err) {
      console.error('Error solicitando extensión del préstamo', err)
      setRenewError(getApiErrorMessage(err, 'No se pudo solicitar la extensión del préstamo.'))
    } finally {
      setRenewingLoanId(null)
    }
  }


  if (!user) {
    return null
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="font-display mb-2 tracking-wide text-foreground">Mi cuenta</h2>

      <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
        <h3 className="font-display mb-4 text-lg tracking-wide text-card-foreground">Información personal</h3>
        <dl className="grid gap-4 sm:grid-cols-2">
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

      {renewError ? (
        <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {renewError}
        </div>
      ) : null}

      {renewSuccessMessage ? (
        <div className="mb-4 rounded-sm border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          {renewSuccessMessage}
        </div>
      ) : null}



      <div className="rounded-sm border border-border bg-card p-8 shadow-sm">
        <h3 className="font-display mb-4 text-lg tracking-wide text-card-foreground">Mis préstamos activos</h3>

        {loansError ? (
          <div className="rounded-sm border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {loansError}
          </div>
        ) : loadingLoans ? (
          <p className="font-ui text-muted-foreground">Cargando tus préstamos...</p>
        ) : userLoans.length === 0 ? (
          <p className="font-ui text-muted-foreground">No tienes préstamos activos en este momento.</p>
        ) : (
          <div className="space-y-4">
            {userLoans.map((loan) => (
              <div key={loan.id} className="rounded-sm border border-border bg-sidebar p-4">
                <p className="font-ui text-sm text-card-foreground">
                  <span className="font-medium">Libro:</span> {loan.bookTitle}
                </p>
                <p className="font-ui text-sm text-muted-foreground">
                  <span className="font-medium">Autor:</span> {loan.bookAuthor}
                </p>
                <p className="font-ui text-sm text-muted-foreground">
                  <span className="font-medium">Fecha de préstamo:</span>{' '}
                  {loan.loanDate ? new Date(loan.loanDate).toLocaleDateString() : 'N/A'}
                </p>
                <p className="font-ui text-sm text-muted-foreground">
                  <span className="font-medium">Fecha de vencimiento:</span>{' '}
                  {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                    Activo
                  </span>
                  {loan.isExtended && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      Extendido
                    </span>
                  )}
                </div>
                {!loan.isExtended && (
                  <button
                    className="mt-4 w-full sm:w-auto rounded-sm border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                    onClick={() => void handleRenewLoan(loan.id)}
                    disabled={renewingLoanId === loan.id}
                  >
                    Solicitar Extensión
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
