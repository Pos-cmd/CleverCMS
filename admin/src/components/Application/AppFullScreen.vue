<script setup lang="ts">
import { t } from '@/locales'

defineOptions({
  name: 'AppFullScreen',
})

defineProps<Props>()

interface Props {
  full?: boolean
}
</script>

<template>
  <ButtonIcon :key="String(full)" :tooltip-content="full ? t('icon.fullscreenExit') : t('icon.fullscreen')">
    <i-ph-arrows-in-bold v-if="full" />
    <i-ph-arrows-out-bold v-else />
  </ButtonIcon>
</template>

<style scoped></style>
