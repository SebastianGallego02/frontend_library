import axios from 'axios'

/**
 * Convierte un error de Axios en un mensaje legible y preciso para el usuario.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    // Error de red (Servidor apagado o problemas de conexión)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return 'No se pudo establecer conexión con el servidor. Inténtalo más tarde.'
    }

    const status = error.response.status
    const data = error.response.data

    // Mapeo de códigos de estado HTTP a mensajes amigables
    if (status === 401) return 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.'
    if (status === 403) return 'No tienes permisos suficientes para realizar esta acción.'
    if (status === 404) return 'El recurso solicitado no fue encontrado.'

    // Si el backend devuelve errores de validación (Formato estándar ASP.NET Core)
    if (data?.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join(' — ')
    }

    if (data?.message) return data.message
  }

  return error instanceof Error ? error.message : fallback
}