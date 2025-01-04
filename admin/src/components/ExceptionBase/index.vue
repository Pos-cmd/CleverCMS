<script lang="ts" setup>
import { useRouterPush } from '@/composables/web/useRouterPush';
import { $t } from '@/locales';
import { computed } from 'vue';

defineOptions({ name: 'ExceptionBase' })

const props = withDefaults(defineProps<Props>(), {
  showBackButton: false,
})

type ExceptionType = 
  '403' 
  | '404' 
  | '500' 
  | 'maintenance' 
  | 'section' 
  | 'page' 
  | 'block' 
  | 'menu'
  | 'users'
  | 'role'
  | 'permission'
  | 'account'
  | 'notification'
  | 'setting'

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
  showBackButton?: boolean,
  description?: string
}

const { routerPushByKey } = useRouterPush()

const iconMap: Record<ExceptionType, string> = {
  403: 'no-permission',
  404: 'not-found',
  500: 'service-error',
  maintenance: 'maintenance',
  section: 'content-section',
  page: 'content-page',
  block: 'content-block',
  menu: 'content-menu',
  users: 'user-list',
  role: 'user-role',
  permission: 'user-permission',
  account: 'system-account',
  notification: 'system-notification',
  setting: 'system-setting',
}

const icon = computed(() => iconMap[props.type])
</script>

<template>
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon :local-icon="icon" />
    </div>
    <div class="text-sm text-center text-gray-500">{{ props.description }}</div>
    <slot name="extra">
      <NButton v-if="showBackButton" type="primary" @click="routerPushByKey('root')">
        {{ $t('common.backToHome') }}
      </NButton>
    </slot>
  </div>
</template>

<style scoped></style>
