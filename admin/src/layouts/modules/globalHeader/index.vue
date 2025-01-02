<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app'
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import { useFullscreen } from '@vueuse/core'
import GlobalBreadcrumb from '../globalBreadcrumb/index.vue'
import GlobalLogo from '../globalLogo/index.vue'
import GlobalSearch from '../globalSearch/index.vue'
import ThemeButton from './components/ThemeButton.vue'
import UserAvatar from './components/UserAvatar.vue'

defineOptions({
  name: 'GlobalHeader',
})

defineProps<Props>()

interface Props {
  /** Whether to show the logo */
  showLogo?: App.Global.HeaderProps['showLogo']
  /** Whether to show the menu toggler */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler']
  /** Whether to show the menu */
  showMenu?: App.Global.HeaderProps['showMenu']
}

const appStore = useAppStore()
const themeStore = useThemeStore()
const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <DarkModeContainer class="h-full flex-y-center px-12px shadow-header">
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: `${themeStore.sider.width}px` }" />
    <AppMenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
    <div v-if="showMenu" :id="GLOBAL_HEADER_MENU_ID" class="h-full flex-y-center flex-1-hidden" />
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <div class="h-full flex-y-center justify-end">
      <GlobalSearch />
      <AppFullScreen v-if="!appStore.isMobile" :full="isFullscreen" @click="toggle" />
      <AppLocalPicker :lang="appStore.locale" :lang-options="appStore.localeOptions" @change-lang="appStore.changeLocale" />
      <AppThemeToggle
        :theme-schema="themeStore.themeScheme"
        :is-dark="themeStore.darkMode"
        :show-tooltip="false"
        @switch="themeStore.toggleThemeScheme"
      />
      <ThemeButton />
      <UserAvatar />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
