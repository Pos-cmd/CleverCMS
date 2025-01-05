<script setup lang="ts">
import { useBlocks } from './index'
import BlockSider from './components/BlockSider.vue'
import BlockContent from './components/BlockContent.vue'
import FieldBuilder from '@/shared/modals/FieldBuilder/index.vue'
import { API } from '@/services/api'
import { $t } from '@/locales'
import type { IStoreBlockTypeParams, IUpdateBlockTypeParams } from '@/services/api/content_management/block/types'

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

const fieldBuilderRef = ref<InstanceType<typeof FieldBuilder> | null>(null)

const { mutateAsync: createBlockType, isLoading: createLoader } = API.contentManagement.BlockType.create()
const { mutateAsync: updateBlockType, isLoading: updateLoader } = API.contentManagement.BlockType.update()
const { mutate: toggleBlockTypeActive, isLoading: toggleLoader } = API.contentManagement.BlockType.toggleActive()
const { mutateAsync: deleteBlockType, isLoading: deleteLoader } = API.contentManagement.BlockType.delete()

const submitLoading = computed<boolean>(() => createLoader.value || updateLoader.value || toggleLoader.value || deleteLoader.value)

const handleCreateBlockType = async (data: IStoreBlockTypeParams) => {
  await createBlockType(data)
  refetch()
}

const handleUpdateBlockType = async (data: IUpdateBlockTypeParams) => {
  await updateBlockType(data)
  refetch()
}

const handleShowFieldBuilder = (data?: any) => {
  fieldBuilderRef.value?.handleShowModal(data)
}

const handleToggleBlockType = async (id: number, isActive: boolean) => {
  toggleBlockTypeActive({ id, isActive })
  refetch()
}

const handleDeleteBlockType = async (id: number) => {
  window.$dialog.warning({
    title: $t('page.blocks.deleteTitle'),
    content: $t('page.blocks.deleteMessage'),
    positiveText: $t('button.delete'),
    onPositiveClick: async () => {
      await deleteBlockType(id)
      refetch()
    }
  })
}
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
        @show-field-builder="handleShowFieldBuilder"
        @toggle-block="handleToggleBlockType"
        @delete-block="handleDeleteBlockType"
      />
      <BlockContent 
        :selected-block="selectedBlock" 
        @show-field-builder="handleShowFieldBuilder"
        @toggle-block="handleToggleBlockType"
        @delete-block="handleDeleteBlockType"
      />
    </n-layout>
    <FieldBuilder 
      ref="fieldBuilderRef" 
      :loading="submitLoading" 
      @submit="handleCreateBlockType" 
      @update:data="handleUpdateBlockType"
    />
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
