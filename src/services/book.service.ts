import type { Book, CreateBookRequest, UpdateBookRequest } from '../types/Book'
import api from './api'

/**
 * Books CRUD against the ASP.NET Core backend (BookController → /api/Book).
 */
export const bookService = {
  getAll: () => api.get<Book[]>('/Book').then((res) => res.data),

  getById: (id: number) => api.get<Book>(`/Book/${id}`).then((res) => res.data),

  create: (data: CreateBookRequest) => api.post<Book>('/Book', data).then((res) => res.data),

  update: (id: number, data: UpdateBookRequest) => api.put(`/Book/${id}`, data),

  delete: (id: number) => api.delete(`/Book/${id}`),
}
