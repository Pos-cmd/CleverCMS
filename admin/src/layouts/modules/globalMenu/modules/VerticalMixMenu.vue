<script setup lang="ts">
import { useRouterPush } from '@/composables/web/useRouterPush'
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app'
import { $t } from '@/locales'
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useThemeStore } from '@/stores/modules/theme'
import { useBoolean } from '@clever/hooks'
import { SimpleScrollbar } from '@clever/materials'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMixMenuContext } from '../../../context'
import GlobalLogo from '../../globalLogo/index.vue'
import FirstLevelMenu from '../components/FirstLevelMenu.vue'

defineOptions({
  name: 'VerticalMenuMix',
})

const route = useRoute()
const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const { routerPushByKeyWithMetaQuery } = useRouterPush()
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean()
const {
  allMenus,
  childLevelMenus,
  activeFirstLevelMenuKey,
  setActiveFirstLevelMenuKey,
  getActiveFirstLevelMenuKey,
  //
} = useMixMenuContext()

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted)

const hasChildMenus = computed(() => childLevelMenus.value.length > 0)

const showDrawer = computed(() => hasChildMenus.value && (drawerVisible.value || appStore.mixSiderFixed))

function handleSelectMixMenu(menu: App.Global.Menu) {
  setActiveFirstLevelMenuKey(menu.key)

  if (menu.children?.length) {
    setDrawerVisible(true)
  }
  else {
    routerPushByKeyWithMetaQuery(menu.routeKey)
  }
}

function handleResetActiveMenu() {
  getActiveFirstLevelMenuKey()
  setDrawerVisible(false)
}

const selectedKey = computed(() => {
  const { hideInMenu, activeMenu } = route.meta
  const name = route.name as string

  const routeName = (hideInMenu ? activeMenu : name) || name

  return routeName
})

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
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="allMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: `${themeStore.header.height}px` }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{ width: appStore.mixSiderFixed && hasChildMenus ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :inverted="inverted"
          :style="{ width: showDrawer ? `${themeStore.sider.mixChildMenuWidth}px` : '0px' }"
        >
          <header class="flex-y-center justify-between px-12px" :style="{ height: `${themeStore.header.height}px` }">
            <h2 class="text-16px text-primary font-bold">
              {{ $t('system.title') }}
            </h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar>
            <NMenu
              v-model:expanded-keys="expandedKeys"
              mode="vertical"
              :value="selectedKey"
              :options="childLevelMenus"
              :collapsed="appStore.siderCollapse"
              :collapsed-width="themeStore.sider.collapsedWidth"
              :collapsed-icon-size="22"
              :inverted="inverted"
              :indent="18"
              @update:value="routerPushByKeyWithMetaQuery"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
