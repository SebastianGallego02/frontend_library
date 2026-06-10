export interface Sanction {
  id: number
  userId: string // Guid
  userName?: string // Campo virtual para el mock
  startDate: string
  endDate: string
  isActive: boolean
}