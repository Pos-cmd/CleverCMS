/**
 * Type de base pour les réponses API
 */
interface BaseApiResponse<T = Recordable> {
  code: number
  result: T
  message: string
  type: 'success' | 'error'
}

/**
 * Type pour les réponses de succès
 */
export type SuccessResponse<T = Recordable> = BaseApiResponse<T> & {
  code: 0
  type: 'success'
}

/**
 * Type pour les réponses d'erreur
 */
export type ErrorResponse<T = Recordable> = BaseApiResponse<T> & {
  code: 1
  type: 'error'
}

/**
 * Type union pour toutes les réponses API possibles
 */
export type ApiResponse<T = Recordable> = SuccessResponse<T> | ErrorResponse<T>
