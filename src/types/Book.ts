/**
 * Represents a book in the library system.
 */
export interface Book {
  id: number // Assuming ID is number for backend operations
  title: string
  author: string
  description?: string | null
  publishedYear: number
  imageUrl?: string | null // URL de la imagen de portada
  available: boolean
  copies: number // Total de copias disponibles
}

/**
 * Request payload for creating a new book.
 */
export interface CreateBookRequest {
  title: string
  author: string
  description?: string | null
  publishedYear: number
  imageUrl?: string | null
  available: boolean
  totalCopies: number // Coincide con el nombre de la propiedad en el backend
}

export type UpdateBookRequest = CreateBookRequest