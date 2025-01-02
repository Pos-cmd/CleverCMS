/**
 * namespace Route
 *
 * backend api module: "route"
 */

type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

interface MenuRoute extends ElegantConstRoute {
  id: string;
}

interface UserRoute {
  routes: MenuRoute[];
  home: import('@elegant-router/types').LastLevelRouteKey;
}
