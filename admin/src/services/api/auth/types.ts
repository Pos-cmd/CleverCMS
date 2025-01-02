import { IRole } from '#/model'

/**
 * @description: User token interface
 */
export interface UserTokenModel {
  type: 'bearer'
  name: string | null
  token: string
  abilities: string[]
  lastUsedAt: string
  expiresAt: string
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  email: string
  password: string
  goHome?: boolean
}

/**
 * @description: Register interface parameters
 */
export interface RegisterParams {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number
  token: UserTokenModel
  role: IRole
}
