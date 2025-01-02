/// <reference types="vitest" />

import { format } from 'date-fns'
import { resolve } from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { OUTPUT_DIR } from './config/constant'
import { generateModifyVars } from './config/generate/modify-vars'
import { wrapperEnv } from './config/utils'
import { setupVitePlugin } from './config/vite/plugins'
import { createViteProxy } from './config/vite/proxy'
import pkg from './package.json'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
}

export function r(dir: string) {
  return resolve(__dirname, dir)
}

export default defineConfig(({ command, mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const viteEnv = wrapperEnv(env)

  const { VITE_ADMIN_PORT: VITE_PORT, VITE_BASE_URL: VITE_PUBLIC_PATH, VITE_SOURCE_MAP, VITE_DROP_CONSOLE } = viteEnv
  const isBuild = command === 'build'

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: {
        '~': r('./'),
        '@': r('src'),
        '#': r('types'),
      },
    },
    plugins: setupVitePlugin(viteEnv, isBuild),
    server: {
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createViteProxy(viteEnv, !isBuild),
    },
    build: {
      target: 'es2020',
      cssTarget: 'chrome95',
      outDir: OUTPUT_DIR,

      esbuild: {
        pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      },

      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      sourcemap: VITE_SOURCE_MAP === 'Y',
      chunkSizeWarningLimit: 2000,
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    test: {
      include: ['test/**/*.test.ts'],
      environment: 'jsdom',
      deps: {
        inline: ['@vue', '@vueuse', 'vue-demi', 'date-fns'],
      },
    },
  }
})
