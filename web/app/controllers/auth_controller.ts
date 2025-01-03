import User from '#models/user'
import { ApiResponseService } from '#services/api_response_service'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
  constructor(protected apiResponse: ApiResponseService) {}

  async register({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return response.created(
      this.apiResponse.resultSuccess({ user, token }, { message: i18n.t('auth.registered') })
    )
  }

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return response.ok(
      this.apiResponse.resultSuccess({ user, token }, { message: i18n.t('auth.logged_in') })
    )
  }

  async logout({ auth, response, i18n }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok(this.apiResponse.resultSuccess({}, { message: i18n.t('auth.logged_out') }))
  }

  async me({ auth, response }: HttpContext) {
    await auth.check()

    const user = auth.user!

    return response.ok(this.apiResponse.resultSuccess(user))
  }
}
