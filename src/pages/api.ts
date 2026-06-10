import axios from 'axios'
import { AUTH_TOKEN_KEY } from '../constants/auth'

/** Base URL for the ASP.NET Core API */
export const API_BASE_URL = 'http://localhost:8080/api'

/**
 * Shared Axios instance for all API calls.
 * The request interceptor attaches the JWT from localStorage so protected
 * endpoints receive `Authorization: Bearer <token>` automatically.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
