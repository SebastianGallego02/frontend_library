import type { User } from './User'

/** JWT login/register response from POST /Auth/login and POST /Auth/register */
export interface AuthResponse {
  token: string
  refreshToken?: string
  user?: User
}
