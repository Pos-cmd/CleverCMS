<script setup lang="ts">
  import type { IBasicLazyPaginateMeta } from '@/services/api/type'

  const props = withDefaults(defineProps<{
    meta: IBasicLazyPaginateMeta<any>['meta']
    size?: 'small' | 'medium' | 'large'
    pageSlot?: number
    changePage?: (page: number) => void
  }>(), {
    size: 'medium',
    pageSlot: 6
  })

  const changePage = props.changePage
</script>

<template>
  <n-pagination
    class="flex-je"
    :size
    :page-slot
    :page="meta?.currentPage"
    :page-count="meta?.lastPage"
    :per-page="meta?.perPage"
    @update:page="changePage" />
</template>
