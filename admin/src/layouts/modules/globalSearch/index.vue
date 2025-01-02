<script lang="ts" setup>
import { t } from '@/locales';
import { useBoolean } from '@clever/hooks';
import SearchModal from './components/SearchModal.vue';

defineOptions({ name: 'GlobalSearch' })

const { bool: show, toggle } = useBoolean()
</script>

<template>
  <ButtonIcon :tooltip-content="t('common.search')" @click="toggle">
    <i-ph-magnifying-glass-bold />
  </ButtonIcon>
  <SearchModal v-model:show="show" />
</template>

<style lang="less" scoped></style>
