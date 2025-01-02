<script setup lang="ts">
import { $t } from '@/locales';
import { useAppStore } from '@/stores/modules/app';

defineOptions({
  name: 'ThemeButton',
})

const appStore = useAppStore()
</script>

<template>
  <ButtonIcon
    icon="ph:swatches-bold"
    :tooltip-content="$t('icon.themeSchema')"
    @click="appStore.openThemeDrawer"
  />
</template>

<style scoped></style>
