import type { Loan } from '../types/Loan'
import api from './api'

export const loanService = {
  getAdminAll: () => api.get<Loan[]>('/Loans').then((res) => res.data),
  returnLoan: (loanId: number) => api.post<void>(`/Loans/${loanId}/return`),
}
