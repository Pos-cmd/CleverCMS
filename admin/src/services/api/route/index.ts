import { defHttp } from '@/services/config';

/** get constant routes */
function fetchGetConstantRoutes() {
  return defHttp.get<MenuRoute[]>({ url: '/route/getConstantRoutes' });
}

/** get user routes */
function fetchGetUserRoutes() {
  return defHttp.get<UserRoute>({ url: '/route/getUserRoutes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
function fetchIsRouteExist(routeName: string) {
  return defHttp.get<boolean>({ url: '/route/isRouteExist', params: { routeName } });
}

export default {
  fetchGetConstantRoutes,
  fetchGetUserRoutes,
  fetchIsRouteExist
}
