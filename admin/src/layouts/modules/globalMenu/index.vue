<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import type { Component } from 'vue'
import { computed } from 'vue'
import HorizontalMenu from './modules/HorizontalMenu.vue'
import HorizontalMixMenu from './modules/HorizontalMixMenu.vue'
import ReversedHorizontalMixMenu from './modules/ReversedHorizontalMixMenu.vue'
import VerticalMenu from './modules/VerticalMenu.vue'
import VerticalMixMenu from './modules/VerticalMixMenu.vue'

defineOptions({
  name: 'GlobalMenu',
})

const appStore = useAppStore()
const themeStore = useThemeStore()

const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    'vertical': VerticalMenu,
    'vertical-mix': VerticalMixMenu,
    'horizontal': HorizontalMenu,
    'horizontal-mix': themeStore.layout.reverseHorizontalMix ? ReversedHorizontalMixMenu : HorizontalMixMenu,
  }

  return menuMap[themeStore.layout.mode]
})

const reRenderVertical = computed(() => themeStore.layout.mode === 'vertical' && appStore.isMobile)
</script>

<template>
  <component :is="activeMenu" :key="reRenderVertical" />
</template>

<style scoped></style>
