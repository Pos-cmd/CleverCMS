<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import type { LayoutMode } from '@clever/materials'
import { AdminLayout, LAYOUT_SCROLL_EL_ID } from '@clever/materials'
import { computed, defineAsyncComponent } from 'vue'
import { setupMixMenuContext } from '../context'
import GlobalContent from '../modules/globalContent/index.vue'
import GlobalFooter from '../modules/globalFooter/index.vue'
import GlobalHeader from '../modules/globalHeader/index.vue'
import GlobalSider from '../modules/globalSider/index.vue'
import GlobalTab from '../modules/globalTab/index.vue'
import ThemeDrawer from '../modules/themeDrawer/index.vue'

defineOptions({
  name: 'BaseLayout',
})

const appStore = useAppStore()
const themeStore = useThemeStore()
const { childLevelMenus, isActiveFirstLevelMenuHasChildren } = setupMixMenuContext()

const GlobalMenu = defineAsyncComponent(() => import('../modules/globalMenu/index.vue'))

const layoutMode = computed(() => {
  const vertical: LayoutMode = 'vertical'
  const horizontal: LayoutMode = 'horizontal'
  return themeStore.layout.mode.includes(vertical) ? vertical : horizontal
})

const headerProps = computed(() => {
  const { mode, reverseHorizontalMix } = themeStore.layout

  const headerPropsConfig: Record<UnionKey.ThemeLayoutMode, App.Global.HeaderProps> = {
    'vertical': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true,
    },
    'vertical-mix': {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false,
    },
    'horizontal': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false,
    },
    'horizontal-mix': {
      showLogo: true,
      showMenu: true,
      showMenuToggler: reverseHorizontalMix && isActiveFirstLevelMenuHasChildren.value,
    },
  }

  return headerPropsConfig[mode]
})

const siderVisible = computed(() => themeStore.layout.mode !== 'horizontal')

const isVerticalMix = computed(() => themeStore.layout.mode === 'vertical-mix')

const isHorizontalMix = computed(() => themeStore.layout.mode === 'horizontal-mix')

const siderWidth = computed(() => getSiderWidth())

const siderCollapsedWidth = computed(() => getSiderCollapsedWidth())

function getSiderWidth() {
  const { reverseHorizontalMix } = themeStore.layout
  const { width, mixWidth, mixChildMenuWidth } = themeStore.sider

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? width : 0
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixWidth : width

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}

function getSiderCollapsedWidth() {
  const { reverseHorizontalMix } = themeStore.layout
  const { collapsedWidth, mixCollapsedWidth, mixChildMenuWidth } = themeStore.sider

  if (isHorizontalMix.value && reverseHorizontalMix) {
    return isActiveFirstLevelMenuHasChildren.value ? collapsedWidth : 0
  }

  let w = isVerticalMix.value || isHorizontalMix.value ? mixCollapsedWidth : collapsedWidth

  if (isVerticalMix.value && appStore.mixSiderFixed && childLevelMenus.value.length) {
    w += mixChildMenuWidth
  }

  return w
}
</script>

<template>
  <AdminLayout
    v-model:sider-collapse="appStore.siderCollapse"
    :mode="layoutMode"
    :scroll-el-id="LAYOUT_SCROLL_EL_ID"
    :scroll-mode="themeStore.layout.scrollMode"
    :is-mobile="appStore.isMobile"
    :full-content="appStore.fullContent"
    :fixed-top="themeStore.fixedHeaderAndTab"
    :header-height="themeStore.header.height"
    :tab-visible="themeStore.tab.visible"
    :tab-height="themeStore.tab.height"
    :content-class="appStore.contentXScrollable ? 'overflow-x-hidden' : ''"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :footer-visible="themeStore.footer.visible"
    :footer-height="themeStore.footer.height"
    :fixed-footer="themeStore.footer.fixed"
    :right-footer="themeStore.footer.right"
  >
    <template #header>
      <GlobalHeader v-bind="headerProps" />
    </template>
    <template #tab>
      <GlobalTab />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <GlobalMenu />
    <GlobalContent />
    <ThemeDrawer />
    <template #footer>
      <GlobalFooter />
    </template>
  </AdminLayout>
</template>

<style lang="less">
.scrollbar(@size: 7px, @color: rgba(0, 0, 0, 0.5)) {
  scrollbar-width: thin;
  scrollbar-color: @color transparent;

  &::-webkit-scrollbar-thumb {
    background-color: @color;
    border-radius: @size;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: @color;
    border-radius: @size;
  }
  &::-webkit-scrollbar {
    width: @size;
    height: @size;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
    border-radius: 0;
  }
}

#__SCROLL_EL_ID__ {
  .scrollbar(); // Inclure le mixin avec les valeurs par défaut
}
</style>
