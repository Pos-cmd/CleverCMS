import type { Router } from 'vue-router';
import { createProgressGuard } from './progress';
import { createDocumentTitleGuard } from './title';
import { createStateGuard } from './state';
import { createRouteGuard } from './route';

/**
 * Router guard
 *
 * @param router - Router instance
 */
export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createRouteGuard(router);
  createDocumentTitleGuard(router);
  createStateGuard(router);
}
