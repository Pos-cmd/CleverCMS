/**
 * I18n namespace
 *
 * Locales type
 */
declare namespace I18n {
  type LangType = 'en-US' | 'fr-FR'

  interface LangOption {
    label: string
    key: LangType
  }

  interface FormMsg {
    required: string
    invalid: string
  }

  type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>

  // Improved Schema definition
  type BaseSchema = {
    [key: string]: string | BaseSchema
  }

  interface Schema {
    common: typeof import('../web/resources/lang/fr/common.json')
    theme: typeof import('../web/resources/lang/fr/theme.json')
    auth: typeof import('../web/resources/lang/fr/auth.json')
    component: typeof import('../web/resources/lang/fr/component.json')
    form: typeof import('../web/resources/lang/fr/form.json')
    icon: typeof import('../web/resources/lang/fr/icon.json')
    button: typeof import('../web/resources/lang/fr/button.json')
    routes: typeof import('../web/resources/lang/fr/route.json')
    sys: typeof import('../web/resources/lang/fr/sys.json')
    system: typeof import('../web/resources/lang/fr/system.json')
    [key: string]: BaseSchema
  }

  // Improved type for getting nested keys
  type GetI18nKey<T, Depth extends number[] = []> = Depth['length'] extends 5
    ? never // Limite à 5 niveaux de profondeur
    : T extends Record<string, unknown>
      ? {
          [K in keyof T]: T[K] extends Record<string, unknown>
            ? `${K & string}.${GetI18nKey<T[K], [...Depth, 1]>}`
            : K & string
        }[keyof T]
      : never

  type I18nKey = GetI18nKey<Schema>

  type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>

  interface $T {
    (key: I18nKey): string
    (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string
    (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string
    (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string
    (key: I18nKey, list: unknown[], plural: number): string
    (key: I18nKey, list: unknown[], defaultMsg: string): string
    (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string
    (key: I18nKey, named: Record<string, unknown>, plural: number): string
    (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string
  }
}
