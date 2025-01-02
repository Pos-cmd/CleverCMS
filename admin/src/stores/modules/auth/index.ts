import type { IUser } from '#/model'
import { useRouterPush } from '@/composables/web/useRouterPush'
import type { RoleEnum } from '@/enums/role'
import { SetupStoreId } from '@/enums/store'
import { $t } from '@/locales'
import { API } from '@/services/api'
import { LoginParams, RegisterParams } from '@/services/api/auth/types'
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
  loading: boolean
}

export const useAuthStore = defineStore(SetupStoreId.User,{
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    roleList: [],
    sessionTimeout: false,
    lastUpdateTime: 0,
    loading: false,
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
    isLoading(): boolean {
      return this.loading
    },
  },
  actions: {
    /**
     * Définit le token d'authentification
     * @param {string | undefined} info - Le token à stocker
     */
    setToken(info: string | undefined = '') {
      this.token = info
      localStg.set('token', info)
    },

    /**
     * Définit la liste des rôles de l'utilisateur
     * @param {RoleEnum[]} roleList - Liste des rôles à assigner
     */
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList
      localStg.set('roles', roleList)
    },

    /**
     * Met à jour les informations de l'utilisateur
     * @param {Nullable<IUser>} info - Informations de l'utilisateur
     */
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

    /**
     * Définit l'état d'expiration de la session
     * @param {boolean} flag - État de la session
     */
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag
    },

    /**
     * Réinitialise l'état du store à ses valeurs par défaut
     */
    resetState() {
      this.userInfo = null
      this.token = ''
      this.roleList = []
      this.sessionTimeout = false
    },

    /**
     * Définit l'état de chargement du store
     * @param {boolean} status - État de chargement
     */
    setLoading(status: boolean) {
      this.loading = status
    },

    /**
     * Authentifie l'utilisateur
     * @param {LoginParams & { mode?: ErrorMessageMode }} params - Paramètres de connexion
     * @returns {Promise<IUser | null>} Informations de l'utilisateur connecté
     */
    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode
      },
    ): Promise<IUser | null> {
      try {
        this.setLoading(true)
        const { goHome = true, mode, ...loginParams } = params

        const data = await API.auth.login(loginParams, mode)

        const { token } = data

        this.setToken(token.token)

        return this.afterLoginAction(goHome)
      }
      catch (error) {
        return Promise.reject(error)
      }
      finally {
        this.setLoading(false)
      }
    },

    /**
     * Inscrit un nouvel utilisateur
     * @param {RegisterParams & { mode?: ErrorMessageMode, goHome?: boolean }} params - Paramètres d'inscription
     * @returns {Promise<IUser | null>} Informations de l'utilisateur inscrit
     */
    async register(
      params: RegisterParams & {
        mode?: ErrorMessageMode
        goHome?: boolean
      },
    ): Promise<IUser | null> {
      try {
        this.setLoading(true)
        const { goHome = true, mode, ...registerParams } = params

        const data = await API.auth.register(registerParams, mode)

        const { token } = data

        this.setToken(token.token)

        return this.afterLoginAction(goHome)
      }
      catch (error) {
        return Promise.reject(error)
      }
      finally {
        this.setLoading(false)
      }
    },

    /**
     * Actions à effectuer après la connexion
     * @param {boolean} goHome - Indique si l'utilisateur doit être redirigé vers la page d'accueil
     * @returns {Promise<IUser | null>} Informations de l'utilisateur
     */
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

      window.$notification?.success({
        title: $t('sys.login.loginSuccessTitle'),
        content: $t('sys.login.loginSuccessDesc', { username: userInfo?.firstname }),
        duration: 3000
      })

      return userInfo
    },

    /**
     * Récupère les informations de l'utilisateur courant
     * @returns {Promise<IUser | null>} Informations de l'utilisateur
     */
    async getUserInfoAction(): Promise<IUser | null> {
      try {
        this.setLoading(true)
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
      }
      catch (error) {
        return Promise.reject(error)
      }
      finally {
        this.setLoading(false)
      }
    },

    /**
     * Déconnecte l'utilisateur
     * @param {boolean} goLogin - Indique si l'utilisateur doit être redirigé vers la page de connexion
     */
    async logout(goLogin = false) {
      try {
        this.setLoading(true)
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
      }
      catch (error) {
        console.error('Logout error:', error)
      }
      finally {
        this.setLoading(false)
      }
    },

    /**
     * Affiche une confirmation avant la déconnexion
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
