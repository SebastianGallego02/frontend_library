export interface Book {
  id: string
  title: string
  author: string
}

export const FEATURED_BOOKS: Book[] = [
  { id: '1', title: 'El laberinto de los espíritus', author: 'Carlos Ruiz Zafón' },
  { id: '2', title: 'Cien años de soledad', author: 'Gabriel García Márquez' },
  { id: '3', title: 'La sombra del viento', author: 'Carlos Ruiz Zafón' },
  { id: '4', title: 'Rayuela', author: 'Julio Cortázar' },
  { id: '5', title: 'La casa de los espíritus', author: 'Isabel Allende' },
  { id: '6', title: 'El amor en los tiempos del cólera', author: 'Gabriel García Márquez' },
  { id: '7', title: 'Ficciones', author: 'Jorge Luis Borges' },
  { id: '8', title: 'La ciudad y los perros', author: 'Mario Vargas Llosa' },
  { id: '9', title: 'Pedro Páramo', author: 'Juan Rulfo' },
  { id: '10', title: 'El túnel', author: 'Ernesto Sabato' },
  { id: '11', title: 'Conversación en La Catedral', author: 'Mario Vargas Llosa' },
  { id: '12', title: 'El Aleph', author: 'Jorge Luis Borges' },
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
  { label: 'Devoluciones', href: '#' },
  { label: 'Sanciones', href: '#' },
  { label: 'Préstamos', href: '#' },
] as const
