<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
import { computed } from 'vue'
import { naiveDateLocales, naiveLocales } from './locales/naive'
import { useAppStore } from './stores/modules/app'
import { useThemeStore } from './stores/modules/theme'

defineOptions({
  name: 'App',
})

const appStore = useAppStore()
const themeStore = useThemeStore()

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined))

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale]
})

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale]
})
</script>

<template>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppConfigure>
      <AppProvider>
        <RouterView class="bg-layout" />
      </AppProvider>
    </AppConfigure>
  </NConfigProvider>
</template>

<style scoped></style>
