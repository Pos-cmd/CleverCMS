<script lang="ts" setup>
import { $t } from '@/locales';
import { useThemeStore } from '@/stores/modules/theme';

defineOptions({ name: 'SearchResult' })

defineProps<Props>()

const emit = defineEmits<Emits>()

interface Props {
  options: App.Global.Menu[]
}

interface Emits {
  (e: 'enter'): void
}

const theme = useThemeStore()

const active = defineModel<string>('path', { required: true })

async function handleMouseEnter(item: App.Global.Menu) {
  active.value = item.routePath
}

function handleTo() {
  emit('enter')
}
</script>

<template>
  <NScrollbar>
    <div class="pb-12px">
      <template v-for="item in options" :key="item.routePath">
        <div
          class="mt-8px h-56px flex-y-center cursor-pointer justify-between rounded-4px bg-#e5e7eb px-14px dark:bg-dark"
          :style="{
            background: item.routePath === active ? theme.themeColor : '',
            color: item.routePath === active ? '#fff' : '',
          }"
          @click="handleTo"
          @mouseenter="handleMouseEnter(item)"
        >
          <component :is="item.icon" />
          <span class="ml-5px flex-1">
            {{ (item.i18nKey && $t(item.i18nKey)) || item.label }}
          </span>
          <i-ph-key-return-bold class="icon mr-3px p-2px text-20px" />
        </div>
      </template>
    </div>
  </NScrollbar>
</template>

<style lang="less" scoped></style>
