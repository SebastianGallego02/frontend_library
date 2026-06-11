import type { Book } from '../types/Book' // Importamos la interfaz Book centralizada

// Imagen por defecto para los libros de ejemplo
const DEFAULT_FEATURED_BOOK_IMAGE = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'

export const FEATURED_BOOKS: Book[] = [
  { id: 1, title: 'El laberinto de los espíritus', author: 'Carlos Ruiz Zafón', publishedYear: 2016, available: true, copies: 5, imageUrl: DEFAULT_FEATURED_BOOK_IMAGE },
  { id: 2, title: 'Cien años de soledad', author: 'Gabriel García Márquez', publishedYear: 1967, available: true, copies: 3, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd87?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'La sombra del viento', author: 'Carlos Ruiz Zafón', publishedYear: 2001, available: true, copies: 7, imageUrl: 'https://images.unsplash.com/photo-1532012197247-ab7302936107?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Rayuela', author: 'Julio Cortázar', publishedYear: 1963, available: false, copies: 0, imageUrl: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: 'La casa de los espíritus', author: 'Isabel Allende', publishedYear: 1982, available: true, copies: 2, imageUrl: 'https://images.unsplash.com/photo-1543002588-bdc72358713d?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez', publishedYear: 1985, available: true, copies: 4, imageUrl: 'https://images.unsplash.com/photo-1549298513-49907106922d?auto=format&fit=crop&w=600&q=80' },
  { id: 7, title: 'Ficciones', author: 'Jorge Luis Borges', publishedYear: 1944, available: true, copies: 1, imageUrl: 'https://images.unsplash.com/photo-1535905552-3209357b5072?auto=format&fit=crop&w=600&q=80' },
  { id: 8, title: 'La ciudad y los perros', author: 'Mario Vargas Llosa', publishedYear: 1963, available: true, copies: 6, imageUrl: 'https://images.unsplash.com/photo-1546f69934-92040e32d3d0?auto=format&fit=crop&w=600&q=80' },
  { id: 9, title: 'Pedro Páramo', author: 'Juan Rulfo', publishedYear: 1955, available: true, copies: 3, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd87?auto=format&fit=crop&w=600&q=80' },
  { id: 10, title: 'El túnel', author: 'Ernesto Sabato', publishedYear: 1948, available: true, copies: 2, imageUrl: DEFAULT_FEATURED_BOOK_IMAGE },
  { id: 11, title: 'Conversación en La Catedral', author: 'Mario Vargas Llosa', publishedYear: 1969, available: true, copies: 1, imageUrl: 'https://images.unsplash.com/photo-1532012197247-ab7302936107?auto=format&fit=crop&w=600&q=80' },
  { id: 12, title: 'El Aleph', author: 'Jorge Luis Borges', publishedYear: 1949, available: true, copies: 4, imageUrl: 'https://images.unsplash.com/photo-1543002588-bdc72358713d?auto=format&fit=crop&w=600&q=80' },
]

export const CATEGORIES = [
  'Ficción Literaria',
  'Ensayo y Filosofía',
  'Historia y Biografías',
  'Ciencia y Naturaleza',
  'Poesía Clásica',
  'Arte y Arquitectura',
  'Mitología y Religión',
  'Viajes y Geografía',
] as const

export const ADMIN_LINKS = [
  { label: 'Libros', href: '/books' },
  { label: 'Sanciones', href: '/admin/sanctions' },
  { label: 'Préstamos', href: '/admin/loans' },
] as const
