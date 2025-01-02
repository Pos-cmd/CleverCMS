<script lang="ts" setup>
import { useRouterPush } from '@/composables/web/useRouterPush';
import { $t } from '@/locales';
import { computed } from 'vue';

defineOptions({ name: 'ExceptionBase' })

const props = defineProps<Props>()

type ExceptionType = '403' | '404' | '500' | 'maintenance'

interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   * - maintenance: page under contruction
   */
  type: ExceptionType
}

const { routerPushByKey } = useRouterPush()

const iconMap: Record<ExceptionType, string> = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error',
  maintenance: 'maintenance',
}

const icon = computed(() => iconMap[props.type])
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon :local-icon="icon" />
    </div>
    <NButton type="primary" @click="routerPushByKey('root')">
      {{ $t('common.backToHome') }}
    </NButton>
  </div>
</template>

<style scoped></style>
