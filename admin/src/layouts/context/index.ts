import { useRouteStore } from '@/stores/modules/route'
import { useContext } from '@clever/hooks'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export const { setupStore: setupMixMenuContext, useStore: useMixMenuContext } = useContext('mix-menu', useMixMenu)

function useMixMenu() {
  const route = useRoute()
  const routeStore = useRouteStore()

  const activeFirstLevelMenuKey = ref('')

  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key
  }

  function getActiveFirstLevelMenuKey() {
    const { hideInMenu, activeMenu } = route.meta
    const name = route.name as string

    const routeName = (hideInMenu ? activeMenu : name) || name

    const [firstLevelRouteName] = routeName.split('_')

    setActiveFirstLevelMenuKey(firstLevelRouteName)
  }

  const allMenus = computed<App.Global.Menu[]>(() => routeStore.menus)

  const firstLevelMenus = computed<App.Global.Menu[]>(() =>
    routeStore.menus.map((menu) => {
      const { children: _, ...rest } = menu

      return rest
    }),
  )

  const childLevelMenus = computed<App.Global.Menu[]>(
    () => routeStore.menus.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || [],
  )

  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value)

    return Boolean(findItem?.children?.length)
  })

  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey()
    },
    { immediate: true },
  )

  return {
    allMenus,
    firstLevelMenus,
    childLevelMenus,
    isActiveFirstLevelMenuHasChildren,
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    getActiveFirstLevelMenuKey,
  }
}
