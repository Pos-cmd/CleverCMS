<script setup lang="ts">
import { useRouterPush } from '@/composables/web/useRouterPush'
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useThemeStore } from '@/stores/modules/theme'
import { SimpleScrollbar } from '@clever/materials'
import type { RouteKey } from '@elegant-router/types'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMixMenuContext } from '../../../context'

defineOptions({
  name: 'ReversedHorizontalMixMenu',
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const {
  firstLevelMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  isActiveFirstLevelMenuHasChildren,
} = useMixMenuContext()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  const routeName = (hideInMenu ? activeMenu : name) || name

  return routeName
})

function handleSelectMixMenu(key: RouteKey) {
  setActiveFirstLevelMenuKey(key)

  if (!isActiveFirstLevelMenuHasChildren.value) {
    routerPushByKeyWithMetaQuery(key)
  }
}

const expandedKeys = ref<string[]>([])

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = []
    return
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value)
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys()
  },
  { immediate: true },
)
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="firstLevelMenus"
      :indent="18"
      responsive
      @update:value="handleSelectMixMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <NMenu
        v-model:expanded-keys="expandedKeys"
        mode="vertical"
        :value="selectedKey"
        :collapsed="appStore.siderCollapse"
        :collapsed-width="themeStore.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="childLevelMenus"
        :indent="18"
        @update:value="routerPushByKeyWithMetaQuery"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
