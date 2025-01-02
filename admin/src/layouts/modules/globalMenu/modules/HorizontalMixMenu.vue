<script setup lang="ts">
import { useRouterPush } from '@/composables/web/useRouterPush'
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { useAppStore } from '@/stores/modules/app'
import { useThemeStore } from '@/stores/modules/theme'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMixMenuContext } from '../../../context'
import FirstLevelMenu from '../components/FirstLevelMenu.vue'

defineOptions({
  name: 'HorizontalMixMenu',
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const { allMenus, childLevelMenus, activeFirstLevelMenuKey, setActiveFirstLevelMenuKey } = useMixMenuContext()
const { routerPushByKeyWithMetaQuery } = useRouterPush()

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  const routeName = (hideInMenu ? activeMenu : name) || name

  return routeName
})

function handleSelectMixMenu(menu: App.Global.Menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (!menu.children?.length) {
    routerPushByKeyWithMetaQuery(menu.routeKey)
  }
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="childLevelMenus"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <FirstLevelMenu
      :menus="allMenus"
      :active-menu-key="activeFirstLevelMenuKey"
      :sider-collapse="appStore.siderCollapse"
      :dark-mode="themeStore.darkMode"
      :theme-color="themeStore.themeColor"
      @select="handleSelectMixMenu"
      @toggle-sider-collapse="appStore.toggleSiderCollapse"
    >
      <slot />
    </FirstLevelMenu>
  </Teleport>
</template>

<style scoped></style>
