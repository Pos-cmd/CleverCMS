<script setup lang="ts">
import { t } from '@/locales'

defineOptions({
  name: 'AppReloadButton',
})

defineProps<Props>()

interface Props {
  loading?: boolean
}
</script>

<template>
  <ButtonIcon :tooltip-content="t('icon.reload')">
    <i-ph-arrow-clockwise-bold :class="{ 'animate-spin animate-duration-750': loading }" />
  </ButtonIcon>
</template>

<style scoped></style>
