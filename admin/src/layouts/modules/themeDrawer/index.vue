<script setup lang="ts">
import { $t } from '@/locales'
import { useAppStore } from '@/stores/modules/app'
import ConfigOperation from './modules/ConfigOperation.vue'
import DarkMode from './modules/DarkMode.vue'
import LayoutMode from './modules/LayoutMode.vue'
import PageFun from './modules/PageFun.vue'
import ThemeColor from './modules/ThemeColor.vue'

defineOptions({
  name: 'ThemeDrawer',
})

const appStore = useAppStore()
</script>

<template>
  <NDrawer v-model:show="appStore.themeDrawerVisible" display-directive="show" :width="360">
    <NDrawerContent :title="$t('theme.themeDrawerTitle')" :native-scrollbar="false" closable>
      <DarkMode />
      <LayoutMode />
      <ThemeColor />
      <PageFun />
      <template #footer>
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
