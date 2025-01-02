<script setup>
import { useAppStore } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import { useThemeStore } from '@/stores/modules/theme'

const themeStore = useThemeStore()
const appStore = useAppStore()
const userStore = useAuthStore()
</script>

<template>
  <nav class="mt-6 inline-flex gap-2 text-xl">
    <AppThemeToggle
      :theme-schema="themeStore.themeScheme"
      :is-dark="themeStore.darkMode"
      :show-tooltip="false"
      @switch="themeStore.toggleThemeScheme"
    />

    <AppLocalPicker
      :lang="appStore.locale"
      :lang-options="appStore.localeOptions"
      :show-tooltip="false"
      @change-lang="appStore.changeLocale"
    />

    <AppLogout
      v-if="userStore.getToken"
      :show-tooltip="false"
      @logout="userStore.confirmLoginOut"
    />
  </nav>
</template>
