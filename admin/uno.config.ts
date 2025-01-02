import { presetSoybeanAdmin } from '@clever/uno-preset'
import { transformerDirectives, transformerVariantGroup } from 'unocss'
import type { Theme } from 'unocss/preset-uno'
import presetUno from 'unocss/preset-uno'
import { defineConfig } from 'unocss/vite'
import { themeVars } from './src/theme/vars'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    ...themeVars,
    fontSize: {
      'icon-xs': '0.875rem',
      'icon-small': '1rem',
      'icon': '1.125rem',
      'icon-large': '1.5rem',
      'icon-xl': '2rem',
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [presetUno({ dark: 'class' }), presetSoybeanAdmin()],
})
