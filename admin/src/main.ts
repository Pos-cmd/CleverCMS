import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setDateFnsLocale, setupAppVersionNotification, setupIconifyOffline, setupLoading, setupNProgress } from './plugins'
import './plugins/assets'
import { setupRouter } from './router'
import { setupStore } from './stores'

async function setupApp() {
  setupLoading()

  setupNProgress()

  setupIconifyOffline()

  setDateFnsLocale()

  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  setupI18n(app)

  setupAppVersionNotification()

  app.mount('#app')
}

setupApp()
