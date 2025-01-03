import type { Router } from 'vue-router';

export function createProgressGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    window.$loadingBar?.start?.();
    next();
  });
  router.afterEach(_to => {
    window.$loadingBar?.finish?.();
  });
}
