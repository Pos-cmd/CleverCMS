import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AuthRoutes from './auth.js'
import {
  blockRoute,
  blockTypeRoute,
  menuItemRoute,
  menuRoute,
  pageRoute,
  sectionRoute,
  sectionTypeRoute,
  seoMetaRoute,
} from './content_management.js'

router
  .group(() => {
    /*
    |--------------------------------------------------------------------------
    | Authentication routes file
    |--------------------------------------------------------------------------
    */
    AuthRoutes()

    /*
    |--------------------------------------------------------------------------
    | Content Management routes file
    |--------------------------------------------------------------------------
    */
    router
      .group(() => {
        blockRoute()
        blockTypeRoute()
        menuItemRoute()
        menuRoute()
        pageRoute()
        sectionRoute()
        sectionTypeRoute()
        seoMetaRoute()
      })
      .as('content_management')
      .prefix('/content-management')
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api')
  .as('api')
