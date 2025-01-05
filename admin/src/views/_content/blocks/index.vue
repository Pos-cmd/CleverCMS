<script setup lang="ts">
import { useBlocks } from './index'
import BlockSider from './components/BlockSider.vue'
import BlockContent from './components/BlockContent.vue'

const { 
  selectedKey, 
  selectedBlock, 
  blockTypeResult, 
  isLoading, 
  refetch,
  searchValue,
  handleSearch,
  handleClearSearch,
  handlePageChange 
} = useBlocks()
</script>

<template>
  <PageWrapper>
    <n-layout has-sider position="absolute" style="height: 100%;">
      <BlockSider
        v-model:search-value="searchValue"
        :selected-key="selectedKey"
        :block-type-result="blockTypeResult"
        :is-loading="isLoading"
        @update:selected-key="(value) => selectedKey = value"
        @update:search-value="(value) => searchValue = value"
        @search="handleSearch"
        @clear-search="handleClearSearch"
        @page-change="handlePageChange"
        @refetch="refetch"
      />
      <BlockContent :selected-block="selectedBlock" />
    </n-layout>
  </PageWrapper>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-page-wrapper';

.@{prefix-cls} {
  position: relative;

  .@{prefix-cls}-content {
    margin: 0;
    height: 100%;
  }
}
</style>
