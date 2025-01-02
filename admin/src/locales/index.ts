import { localStg } from '@/utils/storage'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './en'
import fr from './fr'

// export type LangType = 'en' | 'fr'

export const i18n = createI18n({
  locale: (localStg.get('lang') as I18n.LangType) || 'fr-FR',
  fallbackLocale: 'fr',
  messages: {
    'en-US': en,
    'fr-FR': fr,
  },
  legacy: false,
})

export function setupI18n(app: App) {
  app.use(i18n)
}
export const $t: I18n.$T = i18n.global.t
export function setLocale(locale: I18n.LangType) {
  i18n.global.locale.value = locale
}
