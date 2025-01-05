import { useSvgIcon } from '@/composables/web/useSvgIcon'
import { $t } from '@/locales'
import type { ElegantConstRoute, LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

/**
 * Filter auth routes by roles
 *
 * @param routes Auth routes
 * @param roles Roles
 */
export function filterAuthRoutesByRoles(routes: ElegantConstRoute[], roles: string[]) {
  return routes.flatMap(route => filterAuthRouteByRoles(route, roles))
}

/**
 * Filter auth route by roles
 *
 * @param route Auth route
 * @param roles Roles
 */
function filterAuthRouteByRoles(route: ElegantConstRoute, roles: string[]) {
  const routeRoles = (route.meta && route.meta.roles) || []

  // if the route's "roles" is empty, then it is allowed to access
  const isEmptyRoles = !routeRoles.length

  // if the user's role is included in the route's "roles", then it is allowed to access
  const hasPermission = routeRoles.some(role => roles.includes(role))

  const filterRoute = { ...route }

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap(item => filterAuthRouteByRoles(item, roles))
  }

  return hasPermission || isEmptyRoles ? [filterRoute] : []
}

/**
 * sort route by order
 *
 * @param route route
 */
function sortRouteByOrder(route: ElegantConstRoute) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
    route.children.forEach(sortRouteByOrder)
  }

  return route
}

/**
 * sort routes by order
 *
 * @param routes routes
 */
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0))
  routes.forEach(sortRouteByOrder)

  return routes
}

/**
 * Transforme les routes en menus globaux avec support des groupes et dividers
 * 
 * @param routes - Routes d'authentification
 * @returns Menus globaux structurés
 */
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]): App.Global.Menu[] {
  const groupedMenus = new Map<string, App.Global.Menu[]>();
  const defaultGroup = 'ungrouped';
  const result: App.Global.Menu[] = [];

  // Trie initial des routes par ordre
  const sortedRoutes = [...routes].sort((a, b) => 
    (a.meta?.order || 0) - (b.meta?.order || 0)
  );

  // Première passe : création des menus et groupement
  sortedRoutes.forEach((route) => {
    if (route.meta?.hideInMenu) return;

    const menu = getGlobalMenuByBaseRoute(route);

    // Définir groupOrder pour les menus non groupés
    if (!route.meta?.group) {
      menu.groupOrder = route.meta?.order || 0;
    }

    // Gestion des enfants
    if (route.children?.some(child => !child.meta?.hideInMenu)) {
      menu.children = getGlobalMenusByAuthRoutes(route.children);
    }

    // Gestion des groupes
    const groupName = route.meta?.group?.name || defaultGroup;
    const groupedItems = groupedMenus.get(groupName) || [];
    groupedItems.push(menu);
    groupedMenus.set(groupName, groupedItems);

    // Ajout du divider si nécessaire
    if (route.meta?.divider) {
      groupedItems.push({
        key: `divider-${route.name}`,
        type: 'divider'
      } as App.Global.Menu);
    }
  });

  // Deuxième passe : structuration finale du menu
  groupedMenus.forEach((menus, groupName) => {
    if (groupName === defaultGroup) {
      result.push(...menus);
    } else {
      // Création du groupe
      const groupedRoute = sortedRoutes.find(r => r.meta?.group?.name === groupName);
      result.push({
        key: `group-${groupName}`,
        label: groupedRoute?.meta?.group?.i18nKey ? $t(groupedRoute.meta.group.i18nKey) : groupName,
        type: 'group',
        groupOrder: groupedRoute?.meta?.group?.order || 0,
        children: menus
      } as App.Global.Menu);
    }
  });

  // console.log({ result })

  // Tri final des groupes
  return result.sort((a, b) => (a.groupOrder || 0) - (b.groupOrder || 0));
}

/**
 * Met à jour les libellés des menus selon la locale
 * 
 * @param menus - Menus à mettre à jour
 * @returns Menus avec libellés mis à jour
 */
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]): App.Global.Menu[] {
  return menus.map(menu => {
    if (menu.type === 'divider') {
      return menu;
    }

    const updatedMenu = { ...menu };

    if (menu.i18nKey) {
      updatedMenu.label = $t(menu.i18nKey);
    }

    if (menu.children?.length) {
      updatedMenu.children = updateLocaleOfGlobalMenus(menu.children);
    }

    return updatedMenu;
  });
}

/**
 * Get global menu by route
 *
 * @param route
 */
function getGlobalMenuByBaseRoute(route: RouteLocationNormalizedLoaded | ElegantConstRoute) {
  const { SvgIconVNode } = useSvgIcon()

  const { name, path } = route
  const { title, i18nKey, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {}

  const label = i18nKey ? $t(i18nKey) : title!

  const menu: App.Global.Menu = {
    key: name as string,
    label,
    i18nKey,
    routeKey: name as RouteKey,
    routePath: path as RouteMap[RouteKey],
    icon: SvgIconVNode({
      icon,
      localIcon,
      fontSize: iconFontSize || 20,
    }),
  }

  return menu
}

/**
 * Get cache route names
 *
 * @param routes Vue routes (two levels)
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  const cacheNames: LastLevelRouteKey[] = []

  routes.forEach((route) => {
    // only get last two level route, which has component
    route.children?.forEach((child) => {
      if (child.component && child.meta?.keepAlive) {
        cacheNames.push(child.name as LastLevelRouteKey)
      }
    })
  })

  return cacheNames
}

/**
 * Is route exist by route name
 *
 * @param routeName
 * @param routes
 */
export function isRouteExistByRouteName(routeName: RouteKey, routes: ElegantConstRoute[]) {
  return routes.some(route => recursiveGetIsRouteExistByRouteName(route, routeName))
}

/**
 * Recursive get is route exist by route name
 *
 * @param route
 * @param routeName
 */
function recursiveGetIsRouteExistByRouteName(route: ElegantConstRoute, routeName: RouteKey) {
  let isExist = route.name === routeName

  if (isExist) {
    return true
  }

  if (route.children && route.children.length) {
    isExist = route.children.some(item => recursiveGetIsRouteExistByRouteName(item, routeName))
  }

  return isExist
}

/**
 * Get selected menu key path
 *
 * @param selectedKey
 * @param menus
 */
export function getSelectedMenuKeyPathByKey(selectedKey: string, menus: App.Global.Menu[]) {
  const keyPath: string[] = []

  menus.some((menu) => {
    const path = findMenuPath(selectedKey, menu)

    const find = Boolean(path?.length)

    if (find) {
      keyPath.push(...path!)
    }

    return find
  })

  return keyPath
}

/**
 * Find menu path
 *
 * @param targetKey Target menu key
 * @param menu Menu
 */
function findMenuPath(targetKey: string, menu: App.Global.Menu): string[] | null {
  const path: string[] = []

  function dfs(item: App.Global.Menu): boolean {
    path.push(item.key)

    if (item.key === targetKey) {
      return true
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true
        }
      }
    }

    path.pop()

    return false
  }

  if (dfs(menu)) {
    return path
  }

  return null
}

/**
 * Transform menu to breadcrumb
 *
 * @param menu
 */
function transformMenuToBreadcrumb(menu: App.Global.Menu) {
  const { children, ...rest } = menu

  const breadcrumb: App.Global.Breadcrumb = {
    ...rest,
  }

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb)
  }

  return breadcrumb
}

/**
 * Get breadcrumbs by route
 *
 * @param route
 * @param menus
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: App.Global.Menu[],
): App.Global.Breadcrumb[] {
  const key = route.name as string
  const activeKey = route.meta?.activeMenu

  const menuKey = activeKey || key

  for (const menu of menus) {
    if (menu.key === menuKey) {
      const breadcrumbMenu = menuKey !== activeKey ? menu : getGlobalMenuByBaseRoute(route)

      return [transformMenuToBreadcrumb(breadcrumbMenu)]
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children)
      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result]
      }
    }
  }

  return []
}

/**
 * Transform menu to searchMenus
 *
 * @param menus - menus
 * @param treeMap
 */
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
  if (menus && menus.length === 0)
    return []
  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur)
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap)
    }
    return acc
  }, treeMap)
}
