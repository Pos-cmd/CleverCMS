import type { App } from 'vue';
import { createPinia } from 'pinia';
import { PiniaColada } from '@pinia/colada'
import { resetSetupStore } from './plugins';

const store = createPinia();

/** Setup Vue store plugin pinia */
export function setupStore(app: App) {

  store.use(resetSetupStore);

  app.use(store);
  app.use(PiniaColada);
}

export { store }
