<script setup lang="ts">
import { useRouterPush } from '@/composables/web/useRouterPush'
import { useSvgIcon } from '@/composables/web/useSvgIcon'
import { $t } from '@/locales'
import { useAuthStore } from '@/stores/modules/auth'
import type { VNode } from 'vue'
import { computed } from 'vue'

defineOptions({
  name: 'UserAvatar',
})

const userStore = useAuthStore()
const { routerPushByKey, toLogin } = useRouterPush()
const { SvgIconVNode } = useSvgIcon()

type DropdownKey = 'logout'

type DropdownOption =
  | {
    key: DropdownKey
    label: string
    icon?: () => VNode
  }
  | {
    type: 'divider'
    key: string
  }

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('icon.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out-bold', fontSize: 18 }),
    },
  ]

  return opts
})

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    userStore.confirmLoginOut()
  }
  else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key)
  }
}
</script>

<template>
  <NButton v-if="!userStore.getToken" quaternary @click="toLogin()">
    {{ $t('sys.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <NAvatar :src="userStore.getUserInfo.avatar" size="small" round class="text-icon-large" />
        <span class="text-16px font-medium">{{ userStore.getUserInfo.fullname }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
