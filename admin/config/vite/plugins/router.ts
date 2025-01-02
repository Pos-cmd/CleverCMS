import type { RouteKey } from '@elegant-router/types'
import ElegantVueRouter from '@elegant-router/vue/vite'
import type { RouteMeta } from 'vue-router'

export function setupElegantRouter() {
  return ElegantVueRouter({
    alias: {
      '@': 'src',
    },
    layouts: {
      base: 'src/layouts/baseLayout/index.vue',
      blank: 'src/layouts/blankLayout/index.vue',
    },
    dtsDir: 'types/elegant-router.d.ts',
    routePathTransformer(routeName, routePath) {
      const key = routeName as RouteKey

      if (key === 'login') {
        const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat']

        const moduleReg = modules.join('|')

        return `/login/:module(${moduleReg})?`
      }

      return routePath
    },
    onRouteMetaGen(routeName) {
      const key = routeName as RouteKey

      const constantRoutes: RouteKey[] = ['login', '403', '404', '500']

      const meta: Partial<RouteMeta> = {
        title: key,
        i18nKey: `route.${key}` as I18n.I18nKey,
      }

      if (constantRoutes.includes(key)) {
        meta.constant = true
      }

      return meta
    },
  })
}
