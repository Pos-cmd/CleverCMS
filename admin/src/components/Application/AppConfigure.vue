<script setup lang="ts">
import { useThemeStore } from '@/stores/modules/theme'
import { getNaiveCssVars } from '@/stores/modules/theme/shared'
import { prefixCls as __prefixCls } from '@/theme/vars'
import { useCssVar } from '@vueuse/core'
import { kebabCase } from 'lodash-es'
import { useThemeVars } from 'naive-ui'
import { createAppProviderContext } from './useAppContext'

defineOptions({
  name: 'AppConfigure',
})

const props = defineProps({
  prefixCls: { type: String, default: __prefixCls },
})

const el = document.documentElement
const prefix = '--app'

const isMobile = ref(false)

const { prefixCls } = toRefs(props)
// Inject variables into the global
createAppProviderContext({ prefixCls, isMobile })

const themeVars = useThemeVars()

const themeStore = useThemeStore()

const cssVarsMap = new Map()

const cssVarsList: [string, string?][] = [
  ['primaryColor'],
  ['primaryColorHover'],
  ['primaryColorPressed'],
  ['primaryColorSuppl'],
  ['textColorBase', 'textColor'],
  ['textColor1'],
  ['textColor2'],
  ['textColor3'],
  ['bodyColor'],
  ['borderColor'],
  ['hoverColor'],
  ['pressedColor'],
  ['cubicBezierEaseInOut', 'bezier'],
  ['cubicBezierEaseIn', 'bezier-in'],
  ['cubicBezierEaseOut', 'bezier-out'],
]

const appComBgColorRef = useCssVar(`${prefix}-component-bg-color`, el)
useCssVar(`${prefix}-transition-duration`, el).value = '.3s'

for (const item of cssVarsList)
  cssVarsMap.set(...genCssVarMapParameters(...item))

function genCssVarMapParameters(keyName: string, alias?: string) {
  return [useCssVar(`${prefix}-${kebabCase(alias ?? keyName)}`, el), keyName] as const
}

const { color: darkComBgColor } = getNaiveCssVars('Modal', true)

watch(
  () => themeStore.themeScheme,
  (val) => {
    switch (val) {
      case 'dark':
        appComBgColorRef.value = darkComBgColor
        break
      case 'light':
        appComBgColorRef.value = '#fff'
        break
      default:
        break
    }
  },
  { immediate: true },
)

watch(
  themeVars,
  (list) => {
    console.log(list, 'list')
    for (const [key, val] of cssVarsMap)
      key.value = list[val] ?? val
  },
  { immediate: true },
)
</script>

<template>
  <slot />
</template>
