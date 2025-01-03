/*
|--------------------------------------------------------------------------
| Auth routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

export default () =>
  router
    .group(() => {
      router.post('/register', [AuthController, 'register']).as('register')
      router.post('/login', [AuthController, 'login']).as('login')
      router
        .group(() => {
          router.post('/logout', [AuthController, 'logout']).as('logout')
          router.get('/getUserInfo', [AuthController, 'me']).as('me')
        })
        .use(
          middleware.auth({
            guards: ['api'],
          })
        )
    })
    .prefix('/auth')
    .as('auth')
