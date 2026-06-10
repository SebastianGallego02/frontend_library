import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { bookService } from '../services/book.service'

type Book = {
  id: string
  title: string
  author: string
  year: number
  imageUrl: string
  available?: boolean
}

const FALLBACK_BOOKS: Book[] = [
  {
    id: 'fallback-1',
    title: 'La noche en que lo mismo ocurrió',
    author: 'María Sánchez',
    year: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    id: 'fallback-2',
    title: 'El jardín de los libros perdidos',
    author: 'Carlos Medina',
    year: 2021,
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    id: 'fallback-3',
    title: 'Cuentos de una biblioteca urbana',
    author: 'Ana López',
    year: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
  {
    id: 'fallback-4',
    title: 'El viaje de los libros azules',
    author: 'Fernando Ríos',
    year: 2020,
    imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    available: true,
  },
]

export default function Home() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>(FALLBACK_BOOKS)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isLoaning, setIsLoaning] = useState(false)
  const [loanMessage, setLoanMessage] = useState<string | null>(null)
  const [loanError, setLoanError] = useState<string | null>(null)

  const loanNotification = useMemo(() => {
    if (!loanMessage) return null
    return (
      <div className="fixed right-4 top-4 z-50 rounded-md border border-border bg-foreground/95 px-4 py-3 text-sm text-background shadow-lg">
        {loanMessage}
      </div>
    )
  }, [loanMessage])

  useEffect(() => {
    let isMounted = true

    async function loadBooks() {
      setIsLoading(true)

      try {
        const result = await bookService.getAll()
        console.log('Home: bookService.getAll() result', result)

        const maybeBooks = Array.isArray(result)
          ? result
          : Array.isArray((result as any)?.data)
          ? (result as any).data
          : Array.isArray((result as any)?.items)
          ? (result as any).items
          : Array.isArray((result as any)?.books)
          ? (result as any).books
          : Array.isArray((result as any)?.value)
          ? (result as any).value
          : null

        if (!Array.isArray(maybeBooks)) {
          console.debug('Home: bookService devolvió un formato inesperado, mantengo el fallback.', result)
          return
        }

        if (maybeBooks.length === 0) {
          console.debug('Home: bookService devolvió arreglo vacío, mantengo el fallback.')
          return
        }

        if (isMounted) {
          console.log('Home: reemplazando libros estáticos con datos reales', maybeBooks)
          setBooks(
            maybeBooks.map((item) => ({
              id: String((item as any).id),
              title: String((item as any).title ?? ''),
              author: String((item as any).author ?? 'Desconocido'),
              year: Number((item as any).publishedYear ?? (item as any).year ?? new Date().getFullYear()),
              imageUrl:
                String(
                  (item as any).imageUrl ??
                    (item as any).coverUrl ??
                    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
                ),
              available: (item as any).available ?? true,
            })),
          )
        }
      } catch (error) {
        console.error('Home: error cargando libros desde el backend', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadBooks()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLoanRequest = (book: Book) => {
    if (!book.available) return
    setSelectedBook(book)
    setLoanError(null)
    setLoanMessage(null)
    setIsConfirmOpen(true)
  }

  const confirmLoan = async () => {
    if (!selectedBook) return
    if (!user) {
      setLoanError('Debes iniciar sesión para solicitar un préstamo.')
      return
    }

    setIsLoaning(true)
    setLoanError(null)

    try {
      const payload: any = {
        BookId: Number(selectedBook.id),
        UserId: user.id,
      }

      if (Number.isNaN(payload.BookId)) {
        throw new Error('El id del libro no es numérico: ' + selectedBook.id)
      }

      await api.post('/Loans', payload)

      setBooks((previousBooks) =>
        previousBooks.map((book) =>
          book.id === selectedBook.id ? { ...book, available: false } : book,
        ),
      )

      setLoanMessage('Préstamo exitoso')
      setIsConfirmOpen(false)
      setSelectedBook(null)
      setTimeout(() => setLoanMessage(null), 3000)
    } catch (error: any) {
      console.error('Home: error solicitando préstamo', error)

      // If backend returned validation errors in a standard RFC-style payload, show them
      const resp = error?.response?.data
      if (resp && resp.errors && typeof resp.errors === 'object') {
        const messages: string[] = []
        for (const key of Object.keys(resp.errors)) {
          const val = resp.errors[key]
          if (Array.isArray(val)) messages.push(...val.map(String))
          else messages.push(String(val))
        }
        setLoanError(messages.join(' — '))
      } else if (error?.message) {
        setLoanError(String(error.message))
      } else {
        setLoanError('No se pudo completar el préstamo.')
      }
    } finally {
      setIsLoaning(false)
    }
  }

  const closeModal = () => {
    setIsConfirmOpen(false)
    setSelectedBook(null)
    setLoanError(null)
  }

  return (
    <section className="p-4 md:p-6 lg:p-8">
      {loanNotification}
      <header className="mb-8">
        <h1 className="font-display text-3xl tracking-wide text-foreground">Biblioteca</h1>
        <p className="font-ui mt-2 text-sm text-muted-foreground">
          {isLoading ? 'Actualizando catálogo…' : 'Explora nuestros libros disponibles.'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <article
            key={book.id}
            className="group overflow-hidden rounded-sm border border-border bg-card shadow-sm transition hover:shadow-xl"
          >
            <img
              src={book.imageUrl}
              alt={`Portada de ${book.title}`}
              className="h-52 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="font-display text-lg leading-tight text-foreground">{book.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{book.author}</p>
              <p className="mt-1 text-xs uppercase tracking-[.18em] text-primary">{book.year}</p>
              <button
                type="button"
                onClick={() => handleLoanRequest(book)}
                disabled={!book.available}
                className={`mt-4 w-full rounded-sm px-4 py-2 text-sm font-semibold transition ${
                  book.available
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'cursor-not-allowed bg-muted text-muted-foreground'
                }`}
              >
                {book.available ? 'Solicitar Préstamo' : 'No disponible'}
              </button>
            </div>
          </article>
        ))}
      </div>

      {isConfirmOpen && selectedBook && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-xl">
            <h2 className="font-display text-xl text-foreground">Confirmar préstamo</h2>
            <p className="font-ui mt-3 text-sm text-muted-foreground">
              Estás por solicitar el libro <strong>{selectedBook.title}</strong> de {selectedBook.author}.
            </p>
            <p className="font-ui mt-2 text-sm text-muted-foreground">
              ¿Deseas confirmar este préstamo para tu cuenta?
            </p>

            {loanError && (
              <div className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loanError}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoaning}
                className="rounded-sm border border-border px-4 py-2 text-sm text-foreground transition hover:bg-sidebar"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmLoan}
                disabled={isLoaning}
                className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoaning ? 'Enviando…' : 'Confirmar préstamo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}