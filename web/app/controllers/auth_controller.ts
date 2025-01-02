import { resultSuccess } from '#helpers/index'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response, i18n }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return response.created(resultSuccess({ user, token }, { message: i18n.t('auth.registered') }))
  }

  async login({ request, response, i18n }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await User.accessTokens.create(user)

    return response.ok(resultSuccess({ user, token }, { message: i18n.t('auth.logged_in') }))
  }

  async logout({ auth, response, i18n }: HttpContext) {
    const user = auth.user!

    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok(resultSuccess({}, { message: i18n.t('auth.logged_out') }))
  }

  async me({ auth, response }: HttpContext) {
    await auth.check()

    const user = auth.user!

    return response.ok(resultSuccess(user))
  }
}
