<script setup lang="ts">
import { $t } from '@/locales';
import type { PopoverPlacement } from 'naive-ui';

defineOptions({ name: 'AppLogout' })

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom',
})

const emits = defineEmits<Emits>()

interface Props {
  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme
  /** Show tooltip */
  showTooltip?: boolean
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement
}

interface Emits {
  (e: 'logout'): void
}

function handleLogout() {
  emits('logout')
}

const tooltipContent = computed(() => {
  if (!props.showTooltip)
    return ''

  return $t('icon.logout')
})
</script>

<template>
  <ButtonIcon
    icon="ph:sign-out-bold"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleLogout"
  />
</template>
