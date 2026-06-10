export interface Book {
  id: number
  title: string
  author: string
  description: string | null
  publishedYear: number
  available: boolean
  copies: number
}

export interface CreateBookRequest {
  title: string
  author: string
  description?: string | null
  publishedYear: number
  available?: boolean
  TotalCopies: number
}

export type UpdateBookRequest = CreateBookRequest
