import type { AuthResponse } from '../types/AuthResponse'
import type { LoginRequest } from '../types/LoginRequest'
import type { RegisterRequest } from '../types/RegisterRequest'
import api from './api'

/**
 * Authentication API calls against the ASP.NET Core backend.
 * Register and login both return a JWT plus user profile on success.
 */
export const authService = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/Auth/register', data).then((res) => res.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/Auth/login', data).then((res) => res.data),
}
