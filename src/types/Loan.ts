export interface Loan {
  id: number
  bookId: number
  userId: string
  loanDate?: string
  dueDate?: string
  isExtended?: boolean
  isReturned?: boolean
}
