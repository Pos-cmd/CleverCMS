import { dateEnUS, dateFrFR, enUS, frFR } from 'naive-ui';
import type { NDateLocale, NLocale } from 'naive-ui';

export const naiveLocales: Record<I18n.LangType, NLocale> = {
  'fr-FR': frFR,
  'en-US': enUS
};

export const naiveDateLocales: Record<I18n.LangType, NDateLocale> = {
  'fr-FR': dateFrFR,
  'en-US': dateEnUS
};
