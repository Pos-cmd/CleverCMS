import { transformRecordToOption } from '@/utils/common';

export const themeSchemaRecord: Record<UnionKey.ThemeScheme, I18n.Schema> = {
  light: 'theme.themeSchema.light',
  dark: 'theme.themeSchema.dark',
  auto: 'theme.themeSchema.auto'
};

export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord);

export const loginModuleRecord: Record<UnionKey.LoginModule, I18n.Schema> = {
  'pwd-login': 'page.login.pwdLogin.title',
  'code-login': 'page.login.codeLogin.title',
  register: 'page.login.register.title',
  'reset-pwd': 'page.login.resetPwd.title',
  'bind-wechat': 'page.login.bindWeChat.title'
};

export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, I18n.Schema> = {
  vertical: 'theme.layoutMode.vertical',
  'vertical-mix': 'theme.layoutMode.vertical-mix',
  horizontal: 'theme.layoutMode.horizontal',
  'horizontal-mix': 'theme.layoutMode.horizontal-mix'
};

export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord);

export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, I18n.Schema> = {
  wrapper: 'theme.scrollMode.wrapper',
  content: 'theme.scrollMode.content'
};

export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, I18n.Schema> = {
  chrome: 'theme.tab.mode.chrome',
  button: 'theme.tab.mode.button'
};

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, I18n.Schema> = {
  'fade-slide': 'theme.page.mode.fade-slide',
  fade: 'theme.page.mode.fade',
  'fade-bottom': 'theme.page.mode.fade-bottom',
  'fade-scale': 'theme.page.mode.fade-scale',
  'zoom-fade': 'theme.page.mode.zoom-fade',
  'zoom-out': 'theme.page.mode.zoom-out',
  none: 'theme.page.mode.none'
};

export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);
