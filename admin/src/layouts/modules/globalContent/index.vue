<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'
import { useRouteStore } from '@/stores/modules/route'
import { useTabStore } from '@/stores/modules/tab'
import { useThemeStore } from '@/stores/modules/theme'
import { LAYOUT_SCROLL_EL_ID } from '@clever/materials'
import { computed } from 'vue'

defineOptions({
  name: 'GlobalContent',
})

withDefaults(defineProps<Props>(), {
  showPadding: false,
})

interface Props {
  /** Show padding for content */
  showPadding?: boolean
}

const appStore = useAppStore()
const themeStore = useThemeStore()
const routeStore = useRouteStore()
const tabStore = useTabStore()

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''))

function resetScroll() {
  const el = document.querySelector(`#${LAYOUT_SCROLL_EL_ID}`)

  el?.scrollTo({ left: 0, top: 0 })
}
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-leave="resetScroll"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <KeepAlive :include="routeStore.cacheRoutes">
        <component
          :is="Component"
          v-if="appStore.reloadFlag"
          :key="tabStore.getTabIdByRoute(route)"
          :class="{ 'p-16px': showPadding }"
          class="flex-grow bg-layout transition-300"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style></style>
