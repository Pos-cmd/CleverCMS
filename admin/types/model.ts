import { FormSchema } from '@/components/FormBuilder'
import { DefaultStatus } from '@/enums/default_status'
import { SelectOption } from 'naive-ui'

/**
 * @description: User info interface
 */
export interface IUser {
  userId: string | number
  firstname: string
  lastname: string
  fullName: string
  avatar: string
  email: string
  accountStatus?: DefaultStatus
  roles: IRole[]
}

/**
 * @description: Role info interface
 */
export interface IRole {
  id: number
  slug: string
  title: string
  entityType: string
  entityId: number
  scope: string
  allowed: boolean
  createdAt: string
  updatedAt: string
  permissions: IPermission[]
}

/**
 * @description: Permission info interface
 */
export interface IPermission {
  id: number
  slug: string
  title: string
  entityType: string
  entityId: number
  scope: string
  allowed: boolean
  createdAt: string
  updatedAt: string
  roles: IRole[]
}

/**
 * @description: Route meta interface
 */
export interface IRouteMeta {
  /**
   * Title of the route
   *
   * It can be used in document title
   */
  title: string
  /**
   * I18n key of the route
   *
   * It's used in i18n, if it is set, the title will be ignored
   */
  i18nKey?: I18n.I18nKey | null
  /**
   * Roles of the route
   *
   * Route can be accessed if the current user has at least one of the roles
   *
   * It only works when the route mode is "static", if the route mode is "dynamic", it will be ignored
   */
  roles?: string[]
  /** Whether to cache the route */
  keepAlive?: boolean | null
  /**
   * Is constant route
   *
   * when it is set to true, there will be no login verification and no permission verification to access the route
   */
  constant?: boolean | null
  /**
   * Iconify icon
   *
   * It can be used in the menu or breadcrumb
   */
  icon?: string
  /**
   * Local icon
   *
   * In "inertia/assets/icons", if it is set, the icon will be ignored
   */
  localIcon?: string
  /** Icon size. width and height are the same. */
  iconFontSize?: number
  /** Router order */
  order?: number | null
  /** The outer link of the route */
  href?: string | null
  /** Whether to hide the route in the menu */
  hideInMenu?: boolean | null
  /**
   * The menu key will be activated when entering the route
   *
   * The route is not in the menu
   *
   * @example
   *   the route is "user_detail", if it is set to "user_list", the menu "user_list" will be activated
   */
  activeMenu?: import('@elegant-router/types').RouteKey | null
  /**
   * By default, the same route path will use one tab, even with different query, if set true, the route with
   * different query will use different tabs
   */
  multiTab?: boolean | null
  /** If set, the route will be fixed in tabs, and the value is the order of fixed tabs */
  fixedIndexInTab?: number | null
  /** if set query parameters, it will be automatically carried when entering the route */
  query?: { key: string; value: string }[] | null
}

export interface IFieldConfig {
  title: string
  description?: string
  required: boolean
  default?: 'none' | 'default'
  defaultValue?: string
  textarea?: boolean
  localization?: boolean
  time?: boolean
  baseField?: string // Champ pour stocker la référence au champ plainText source
}

export interface IFieldOption extends SelectOption {
  label: string
  value: string
  icon: string
  show?: boolean
  schemas?: FormSchema[]
}

export interface IField {
  order: number
  type: string
  label: string
  name: string
  required: boolean
  options: any[]
  isEditing?: boolean
  config: IFieldConfig
  canBeDuplicate?: boolean
  canBeDeleted?: boolean
  schemas: FormSchema[]
}

export interface IBasicCollectionType {
  id: number
  name: string
  description: string
  fields: IField[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IBlockType extends IBasicCollectionType {}

export interface IBlock {
  id: number
  name: string
  title: string
  slug: string
  blockTypeId: number
  blockType: IBlockType
  content: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}
