import path from 'node:path'
import process from 'node:process'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import Icons from 'unplugin-icons/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function setupIconComponentPlugin(viteEnv: ViteEnv) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv

  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon')

  /** The name of the local icon collection */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(
    `${VITE_ICON_PREFIX}-`,
    '',
  )

  return [
    Icons({
      autoInstall: true, // expiremental
      scale: 1, // Scale of icons against 1em
      defaultStyle: 'display:inline-block;', // Style apply to icons
      defaultClass: '', // Class names apply to icons
      compiler: 'vue3', // 'vue2', 'vue3'
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
      },
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: 'body-last',
      customDomId: '__SVG_ICON_LOCAL__',
    }),
  ]
}
