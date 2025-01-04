import type {
  ComponentPublicInstance,
  ComponentRenderProxy,
  FunctionalComponent,
  VNode,
  VNodeChild,
} from 'vue'


declare global {
  // vue
  declare type PropType<T> = VuePropType<T>
  declare type VueNode = VNodeChild | JSX.Element

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  }

  declare type Nullable<T> = T | null
  declare type NullUndefable<T> = T | null | undefined
  declare type Recordable<T = any> = Record<string, T>
  declare interface ReadonlyRecordable<T = any> {
    readonly [key: string]: T
  }
  declare interface Indexable<T = any> {
    [key: string]: T
  }
  declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  }

  declare interface ObjectConstructor {
    // eslint-disable-next-line ts/method-signature-style
    entries<T extends object>(o: T): [keyof T, T[keyof T]][]
  }

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  declare interface ChangeEvent extends Event {
    target: HTMLInputElement
  }

  declare interface WheelEvent {
    path?: EventTarget[]
  }
  interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  declare interface ViteEnv {
    VITE_HTTP_PROXY: CommonType.YesOrNo
    VITE_ADMIN_PORT: number
    VITE_API_PORT: number
    VITE_BASE_URL: string
    VITE_PROXY: [string, string][]
    VITE_APP_TITLE: string
    VITE_APP_DESC: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_USE_CDN: boolean
    VITE_DROP_CONSOLE: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_LEGACY: boolean
    VITE_USE_IMAGEMIN: boolean
    VITE_SOURCE_MAP: CommonType.YesOrNo
    VITE_GENERATE_UI: string
    /** The prefix of the iconify icon */
    VITE_ICON_PREFIX: 'i'
    /**
     * The prefix of the local icon
     *
     * This prefix is start with the icon prefix
     */
    VITE_ICON_LOCAL_PREFIX: 'i-il'
    /** backend service base url */
    VITE_GLOB_API_URL: string
    /**
     * other backend service base url
     *
     * the value is a json
     */
    VITE_OTHER_GLOB_API_URL: string
    /**
     * Iconify api provider url
     *
     * If the project is deployed in intranet, you can set the api provider url to the local iconify server
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string
    /** Used to differentiate storage across different domains */
    readonly VITE_STORAGE_PREFIX?: string
  }

  declare function parseInt(s: string | number, radix?: number): number

  declare function parseFloat(string: string | number): number

  namespace JSX {
    // tslint:disable no-empty-interface
    type Element = VNode
    // tslint:disable no-empty-interface
    type ElementClass = ComponentRenderProxy
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
