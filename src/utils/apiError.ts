import axios from 'axios'

/** Extract a human-readable message from ASP.NET Core / Axios errors */
export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred.'): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback
  }

  const data = error.response?.data as
    | { message?: string; title?: string; errors?: Record<string, string[]> }
    | undefined

  if (data?.message) return data.message
  if (data?.title) return data.title

  if (data?.errors) {
    const messages = Object.values(data.errors).flat()
    if (messages.length > 0) return messages.join(' ')
  }

  return error.message || fallback
}
