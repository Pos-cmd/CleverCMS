import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevtools from 'vite-plugin-vue-devtools';
import progress from 'vite-plugin-progress';

import { setupUnocss } from './unocss';
import { setupHtmlPlugin } from './html';
import { setupComponentsPlugin } from './componentImport';
import { setupAutoImportPlugin } from './autoImport';
import { setupIconComponentPlugin } from './iconComponentImport';
import { setupElegantRouter } from './router';

export function setupVitePlugin(viteEnv: ViteEnv, isBuild: boolean) {
  const plugins: PluginOption = [
    vue(),
    vueJsx(),
    vueDevtools(),
    setupElegantRouter(),
    setupUnocss(viteEnv),
    setupComponentsPlugin(),
    setupAutoImportPlugin(),
    ...setupIconComponentPlugin(viteEnv),
    progress(),
    setupHtmlPlugin(viteEnv, isBuild)
  ]

  return plugins
}
