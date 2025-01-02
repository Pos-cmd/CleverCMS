import type { Locale } from 'date-fns'
import { format } from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { localStg } from '@/utils/storage'

/**
 * Set date-fns locale and format the current date
 *
 * @param lang
 */
export function setDateFnsLocale(lang: I18n.LangType = 'fr-FR') {
  const localMap = {
    'fr-FR': fr,
    'en-US': enUS,
  } satisfies Record<I18n.LangType, Locale>

  const l = lang || localStg.get('lang') || 'fr-FR'
  const locale = localMap[l]

  const now = new Date()
  const formattedDate = format(now, 'PPPP', { locale })

  console.log(formattedDate)
}
