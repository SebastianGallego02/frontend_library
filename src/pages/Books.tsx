import { type FormEvent, useCallback, useEffect, useState } from 'react'
import FormField from '../components/common/FormField'
import { bookService } from '../services/book.service'
import type { Book, CreateBookRequest } from '../types/Book'
import { getApiErrorMessage } from '../utils/apiError'

const emptyForm = {
  title: '',
  author: '',
  description: '',
  imageUrl: '', // Nuevo campo para la URL de la imagen
  publishedYear: '',
  available: true,
  copies: '1',
}

/**
 * Admin CRUD for books (protected route).
 */
export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadBooks = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await bookService.getAll()
      setBooks(data)
    } catch (err) {
      console.error('Failed to load books', err)
      setError(getApiErrorMessage(err, 'No se pudieron cargar los libros.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadBooks()
  }, [loadBooks])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleEdit = (book: Book) => {
    setEditingId(book.id)
    setForm({
      title: book.title,
      author: book.author,
      description: book.description ?? '',
      publishedYear: String(book.publishedYear),
      available: book.available,
      copies: String(book.copies ?? 1),
      imageUrl: book.imageUrl ?? '', // Cargar la URL de la imagen
    })
    setError('')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este libro?')) return

    setError('')

    try {
      await bookService.delete(id)
      setBooks((prev) => prev.filter((b) => b.id !== id))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo eliminar el libro.'))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload: CreateBookRequest = {
      title: form.title,
      author: form.author,
      description: form.description || null,
      publishedYear: Number(form.publishedYear),
      available: form.available,
      totalCopies: Number(form.copies), // Aseguramos que el nombre de la propiedad coincida con el backend
      imageUrl: form.imageUrl || null, // Incluir la URL de la imagen
    }

    try {
      if (editingId !== null) {
        await bookService.update(editingId, payload)
        setBooks((prev) =>
          prev.map((b) => (b.id === editingId ? { ...b, ...payload } : b)),
        )
      } else {
        const created = await bookService.create(payload)
        setBooks((prev) => [...prev, created])
      }
      resetForm()
    } catch (err) {
      setError(getApiErrorMessage(err, 'No se pudo guardar el libro.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="font-display mb-2 tracking-wide text-foreground">Gestión de libros</h2>
      <p className="font-ui mb-8 text-muted-foreground">
        Crear, editar y eliminar libros del catálogo.
      </p>

      {error && (
        <div
          role="alert"
          className="font-ui mb-6 rounded-sm border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          {error}
        </div>
      )}

      <div className="mb-8 rounded-sm border border-border bg-card p-6 shadow-sm">
        <h3 className="font-display mb-4 text-lg tracking-wide text-card-foreground">
          {editingId !== null ? 'Editar libro' : 'Nuevo libro'}
        </h3>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Título"
            name="title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <FormField
            label="Autor"
            name="author"
            required
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
          />
          <FormField
            label="Año de publicación"
            name="publishedYear"
            type="number"
            required
            min={0}
            value={form.publishedYear}
            onChange={(e) => setForm((f) => ({ ...f, publishedYear: e.target.value }))}
          />
          <FormField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <FormField
            label="URL de la imagen de portada"
            name="imageUrl"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            placeholder="Ej: https://ejemplo.com/portada.jpg"
          />
          <FormField
            label="Número de copias"
            name="copies"
            type="number"
            required
            min={1}
            value={form.copies}
            onChange={(e) => setForm((f) => ({ ...f, copies: e.target.value }))}
          />
          <label className="flex items-center gap-2 rounded-sm border border-border bg-card p-3 text-sm text-foreground shadow-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Disponible para préstamo
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="font-ui rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Guardando…' : editingId !== null ? 'Actualizar' : 'Crear'}
            </button>
            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="font-ui rounded-sm border border-border px-4 py-2 text-sm text-foreground transition hover:bg-sidebar"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border bg-card shadow-sm">
        <table className="font-ui w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-sidebar">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Título</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Autor</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Año</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Copias</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando libros…
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No hay libros registrados.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-card-foreground">{book.title}</td>
                  <td className="px-4 py-3 text-card-foreground">{book.author}</td>
                  <td className="px-4 py-3 text-card-foreground">{book.publishedYear}</td>
                  <td className="px-4 py-3 text-card-foreground">{book.copies}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(book)}
                        className="rounded-sm border border-border px-3 py-1 text-xs transition hover:bg-sidebar"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(book.id)}
                        className="rounded-sm border border-primary/30 px-3 py-1 text-xs text-primary transition hover:bg-primary/10"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
