import type { IUser } from '#/model'
import { useRouterPush } from '@/composables/web/useRouterPush'
import type { RoleEnum } from '@/enums/role'
import { SetupStoreId } from '@/enums/store'
import { $t } from '@/locales'
import { API } from '@/services/api'
import { LoginParams } from '@/services/api/auth/types'
import { store } from '@/stores'
import { localStg } from '@/utils/storage'
import type { ErrorMessageMode } from '@clever/axios'
import { isArray } from '@clever/utils'
import { defineStore } from 'pinia'

interface UserState {
  userInfo: Nullable<IUser>
  token?: string
  roleList: RoleEnum[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export const useAuthStore = defineStore(SetupStoreId.User,{
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    roleList: [],
    sessionTimeout: false,
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(): IUser | Recordable {
      return this.userInfo || localStg.get('user') || {}
    },
    getToken(): string | undefined {
      return this.token || localStg.get('token') || undefined
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : localStg.get('roles') || []
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
    /** is super role in static route */
    isStaticSuper(): boolean {
      const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env

      return VITE_AUTH_ROUTE_MODE === 'static' && this.roleList.includes(VITE_STATIC_SUPER_ROLE)
    },
  },
  actions: {
    setToken(info: string | undefined = '') {
      this.token = info
      localStg.set('token', info)
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      localStg.set('roles', roleList)
    },
    setUserInfo(info: Nullable<IUser>) {
      //@ts-expect-error
      this.userInfo = {
        ...info,
        fullName: `${info?.firstname || ''} ${info?.lastname || ''}`,
        avatar: info?.avatar || `https://api.dicebear.com/9.x/open-peeps/svg?seed=${info?.email}`,
      }
      this.lastUpdateTime = new Date().getTime()
      localStg.set('user', info)
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode
      },
    ): Promise<IUser | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params

        const data = await API.auth.login(loginParams, mode)

        const { token } = data

        this.setToken(token.token)

        return this.afterLoginAction(goHome)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<IUser | null> {
      if (!this.getToken)
        return null

      // get user info
      const userInfo = await this.getUserInfoAction()

      const { sessionTimeout } = this

      if (sessionTimeout) {
        this.setSessionTimeout(false)
      }
      else {
        // TODO: Gérer les permissions a ce niveau
        const routerPush = useRouterPush(false)
        goHome && routerPush.redirectFromLogin()
      }
      return userInfo
    },
    async getUserInfoAction(): Promise<IUser | null> {
      if (!this.getToken)
        return null

      const userInfo = await API.auth.getUserInfo()

      const { roles = [] } = userInfo

      if (isArray(roles)) {
        const roleList = roles.map(item => item.slug) as RoleEnum[]
        this.setRoleList(roleList)
      }
      else {
        userInfo.roles = []
        this.setRoleList([])
      }

      this.setUserInfo(userInfo)
      return userInfo
    },
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await API.auth.doLogout()
        }
        catch {
          console.log('Failed to log out Token')
        }
      }
      this.setToken(undefined)
      this.setSessionTimeout(false)
      this.setUserInfo(null)

      const { toLogin } = useRouterPush(false)

      goLogin && toLogin()
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      window.$dialog?.warning({
        title: $t('sys.app.logoutTip'),
        content: $t('sys.app.logoutMessage'),
        positiveText: $t('button.yes'),
        negativeText: $t('button.back'),
        onPositiveClick: async () => {
          await this.logout(true)
        },
      })
    },
  },
})

// Need to be used outside the setup
export function useAuthStoreWithout() {
  return useAuthStore(store)
}
