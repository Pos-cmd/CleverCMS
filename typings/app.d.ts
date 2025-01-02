declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = import('@clever/color').ColorPaletteNumber

    /** Theme token */
    // eslint-disable-next-line ts/consistent-type-definitions
    type ThemeToken = {
      colors: ThemeTokenColor
      boxShadow: {
        header: string
        sider: string
        tab: string
      }
    }

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme
      /** grayscale mode */
      grayscale: boolean
      /** Whether to recommend color */
      recommendColor: boolean
      /** Theme color */
      themeColor: string
      /** Other color */
      otherColor: OtherColor
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean
      /** Layout */
      layout: {
        /** Layout mode */
        mode: UnionKey.ThemeLayoutMode
        /** Scroll mode */
        scrollMode: UnionKey.ThemeScrollMode
        /**
         * Whether to reverse the horizontal mix
         *
         * if true, the vertical child level menus in left and horizontal first level menus in top
         */
        reverseHorizontalMix?: boolean
      }
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean
        /** Page animate mode */
        animateMode: UnionKey.ThemePageAnimateMode
      }
      /** Header */
      header: {
        /** Header height */
        height: number
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb */
          visible: boolean
          /** Whether to show the breadcrumb icon */
          showIcon: boolean
        }
      }
      /** Tab */
      tab: {
        /** Whether to show the tab */
        visible: boolean
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean
        /** Tab height */
        height: number
        /** Tab mode */
        mode: UnionKey.ThemeTabMode
      }
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean
      /** Sider */
      sider: {
        /** Inverted sider */
        inverted: boolean
        /** Sider width */
        width: number
        /** Collapsed sider width */
        collapsedWidth: number
        /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixWidth: number
        /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixCollapsedWidth: number
        /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixChildMenuWidth: number
      }
      /** Footer */
      footer: {
        /** Whether to show the footer */
        visible: boolean
        /** Whether fixed the footer */
        fixed: boolean
        /** Footer height */
        height: number
        /** Whether float the footer to the right when the layout is 'horizontal-mix' */
        right: boolean
      }
      /** define some theme settings tokens, will transform to css variables */
      tokens: {
        light: ThemeSettingToken
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        }
      }
    }

    interface OtherColor {
      info: string
      success: string
      warning: string
      error: string
    }

    interface ThemeColor extends OtherColor {
      primary: string
    }

    type ThemeColorKey = keyof ThemeColor

    interface ThemeSettingTokenColor {
      /** the progress bar color, if not set, will use the primary color */
      'nprogress'?: string
      'container': string
      'layout': string
      'inverted': string
      'base-text': string
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor
      boxShadow: ThemeSettingTokenBoxShadow
    }

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    }

    type BaseToken = Record<string, Record<string, string>>

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor

    /** Theme token CSS variables */
    interface ThemeTokenCSSVars {
      colors: ThemeTokenColor & { [key: string]: string }
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string }
    }
  }

  /** Service namespace */
  namespace Service {
    /** Other baseURL key */
    type OtherBaseURLKey = 'demo'

    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string
      /** The proxy pattern of the backend service base url */
      proxyPattern: string
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey
    }

    /** The backend service config */
    interface ServiceConfig extends ServiceConfigItem {
      /** Other backend service config */
      other: OtherServiceConfigItem[]
    }

    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>
    }

    /** The backend service response data */
    interface Response<T = unknown> {
      /** The backend service response code */
      code: string
      /** The backend service response message */
      msg: string
      /** The backend service response data */
      data: T
    }

    /** The demo backend service response data */
    interface DemoResponse<T = unknown> {
      /** The backend service response code */
      status: string
      /** The backend service response message */
      message: string
      /** The backend service response data */
      result: T
    }
  }

  /** Global namespace */
  namespace Global {
    type VNode = import('vue').VNode
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded
    type RouteKey = import('@elegant-router/types').RouteKey
    type RouteMap = import('@elegant-router/types').RouteMap
    type RoutePath = import('@elegant-router/types').RoutePath
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey

    /** The global header props */
    interface HeaderProps {
      /** Whether to show the logo */
      showLogo?: boolean
      /** Whether to show the menu toggler */
      showMenuToggler?: boolean
      /** Whether to show the menu */
      showMenu?: boolean
    }

    type MixedOption = import('naive-ui').MenuMixedOption

    /** The global menu */
    interface Menu extends MixedOption {
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string
      /** The menu label */
      label: string
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey | null
      /** The route key */
      routeKey: RouteKey
      /** The route path */
      routePath: RoutePath
      /** The menu icon */
      icon?: () => VNode
      /** The menu children */
      children?: Menu[]
    }

    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[]
    }

    /** Tab route */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>

    /** The global tab */
    interface Tab {
      /** The tab id */
      id: string
      /** The tab label */
      label: string
      /**
       * The new tab label
       *
       * If set, the tab label will be replaced by this value
       */
      newLabel?: string
      /**
       * The old tab label
       *
       * when reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string
      /** The tab route key */
      routeKey: LastLevelRouteKey
      /** The tab route path */
      routePath: RouteMap[LastLevelRouteKey]
      /** The tab route full path */
      fullPath: string
      /** The tab fixed index */
      fixedIndex?: number | null
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string
      /** I18n key */
      i18nKey?: I18n.I18nKey | null
    }

    /** Form rule */
    type FormRule = import('naive-ui').FormItemRule

    /** The global dropdown key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll'
  }
}
