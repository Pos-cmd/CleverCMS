import { PageEnum } from '@/enums/page'
import { useAppStore } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import { useThemeStore } from '@/stores/modules/theme'
import type { Router } from 'vue-router'

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if(to.path == PageEnum.BASE_LOGIN) {
      const appStore = useAppStore()
      const userStore = useAuthStore()
      const themeStore = useThemeStore()

      appStore.$reset()
      userStore.resetState()
      themeStore.resetStore()
    }
  })
}
