<script lang="ts" setup>
import { $t } from '@/locales';

defineOptions({ name: 'SearchFooter' })
</script>

<template>
  <div class="h-44px flex-y-center gap-14px px-24px">
    <span class="flex-y-center">
      <i-ph-key-return-bold class="operate-shadow operate-item" />
      <span>{{ $t('common.confirm') }}</span>
    </span>
    <span class="flex-y-center">
      <i-ph-arrow-up-bold class="operate-shadow operate-item" />
      <i-ph-arrow-down-bold class="operate-shadow operate-item" />
      <span>{{ $t('common.switch') }}</span>
    </span>
    <span class="flex-y-center">
      <i-mdi-keyboard-esc class="operate-shadow operate-item" />
      <span>{{ $t('common.close') }}</span>
    </span>
  </div>
</template>

<style lang="less" scoped>
.operate-shadow {
  box-shadow:
    inset 0 -2px #cdcde6,
    inset 0 0 1px 1px #fff,
    0 1px 2px 1px #1e235a66;
}

.operate-item {
  --uno: mr-6px p-2px text-20px;
}
</style>
