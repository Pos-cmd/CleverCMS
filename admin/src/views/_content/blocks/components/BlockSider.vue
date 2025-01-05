<script setup lang="ts">
import { IBasicCollectionType } from '#/model'
import { useNaiveHelper } from '@/composables/web/useNaiveHelper'
import { $t } from '@/locales'
import { API } from '@/services/api'
import type { IStoreBlockTypeParams, IUpdateBlockTypeParams } from '@/services/api/content_management/block/types'
import MetaPagination from '@/shared/MetaPagination/index.vue'
import FieldBuilder from '@/shared/modals/FieldBuilder/index.vue'

const props = defineProps<{
  selectedKey: number | null
  blockTypeResult: any
  isLoading: boolean
  searchValue: string
}>()

const emit = defineEmits<{
  'update:selectedKey': [value: number]
  'update:searchValue': [value: string]
  'search': []
  'clearSearch': []
  'pageChange': [page: number]
  'refetch': []
}>()

const { renderIcon } = useNaiveHelper()
const fieldBuilderRef = ref<InstanceType<typeof FieldBuilder> | null>(null)

const { mutateAsync: createBlockType, isLoading: createLoader } = API.contentManagement.BlockType.create()
const { mutateAsync: updateBlockType, isLoading: updateLoader } = API.contentManagement.BlockType.update()
const { mutate: toggleBlockTypeActive } = API.contentManagement.BlockType.toggleActive()
const { mutateAsync: deleteBlockType } = API.contentManagement.BlockType.delete()

const submitLoading = computed<boolean>(() => createLoader.value || updateLoader.value)

const dropdownOption = ref([
  {
    label: $t('button.edit'),
    key: 'edit',
    icon: () => renderIcon('i-tabler-edit')
  },
  {
    label: $t('button.toggleActive'),
    key: 'toggleActive',
    icon: () => renderIcon('i-tabler-toggle-right')
  },
  {
    label: $t('button.delete'),
    key: 'delete',
    icon: () => renderIcon('i-tabler-trash')
  }
])

const hasBlocks = computed(() => props.blockTypeResult?.data?.length !== 0)


const handleDropdownSelect = async (key: 'edit' | 'toggleActive' | 'delete', data: IBasicCollectionType) => {
  switch (key) {
    case 'edit':
      fieldBuilderRef.value?.handleShowModal(data)
      break
    case 'toggleActive':
      toggleBlockTypeActive({ id: data.id, isActive: !data.isActive})
      emit('refetch')
      break
    case 'delete':
      window.$dialog.warning({
        title: $t('page.blocks.deleteTitle'),
        content: $t('page.blocks.deleteMessage'),
        positiveText: $t('button.delete'),
        onPositiveClick: async () => {
          await deleteBlockType(data.id)
          emit('refetch')
        }
      })
      break
  }
}

const handleCreateBlockType = async (data: IStoreBlockTypeParams) => {
  await createBlockType(data)
  emit('refetch')
}

const handleUpdateBlockType = async (data: IUpdateBlockTypeParams) => {
  await updateBlockType(data)
  emit('refetch')
}
</script>

<template>
  <n-layout-sider bordered content-style="padding-inline: 24px;" content-class="flex flex-col flex-justify-start py-2">
    <div class="flex flex-col mt-2 gap-4">
      <n-input-group>
        <n-input 
          :value="searchValue" 
          size="small" 
          :placeholder="$t('common.actions.search')" 
          clearable 
          @clear="emit('clearSearch')" 
          @update:value="emit('update:searchValue', $event)"
          @keydown.enter="emit('search')"
        />
        <n-button 
          :loading="isLoading" 
          :disabled="!hasBlocks" 
          size="small" 
          type="primary" 
          secondary 
          :render-icon="() => renderIcon('i-tabler-search')" 
          @click="emit('search')"
        />
      </n-input-group>
    </div>
    <div class="flex flex-col h-full" :class="hasBlocks ? 'flex-justify-between' : 'flex-center'">
      <template v-if="isLoading">
        <n-spin size="medium" />
      </template>
      <n-empty v-else-if="!hasBlocks" :description="$t('page.blocks.emptyMessage')" size="small">
        <template #extra>
          <n-button type="primary" size="tiny" secondary @click="fieldBuilderRef?.handleShowModal()">
            {{ $t('button.create.blocks') }}
            <template #icon>
              <n-icon>
                <i class="i-ph-stack-plus-bold"></i>
              </n-icon>
            </template>
          </n-button>
        </template>
        <template #icon>
          <n-icon>
            <i class="i-ph-stack-duotone"></i>
          </n-icon>
        </template>
      </n-empty>
      <template v-else>
        <div class="flex flex-col mt-2 gap-4">
          <n-list hoverable clickable size="small">
            <n-list-item 
              v-for="item in blockTypeResult?.data" 
              :key="item.id" 
              class="mb-1" 
              :class="{ 'bg-primary-200': selectedKey === item.id}" 
              @click="emit('update:selectedKey', item.id)"
            >
              <div class="flex flex-items-center flex-justify-between">
                <div class="flex-center gap-2">
                  <n-badge :type="item.isActive ? 'success' : 'error'" dot />
                  <n-ellipsis style="max-width: 120px;">{{ item.name }}</n-ellipsis>
                </div>
                <n-dropdown 
                  :options="dropdownOption" 
                  trigger="click" 
                  @select="(key) => handleDropdownSelect(key, item)"
                >
                  <n-button size="tiny" quaternary :render-icon="() => renderIcon('i-tabler-dots')" />
                </n-dropdown>
              </div>
            </n-list-item>
            <n-list-item @click="fieldBuilderRef?.handleShowModal()">
              <div class="flex flex-items-center gap-2">
                <i class="i-ph-stack-plus-duotone text-xl"/>
                <span>{{ $t('button.create.blocks') }}...</span>
              </div>
            </n-list-item>
          </n-list>
        </div>
        <MetaPagination 
          class="mt-2 flex-center" 
          size="small" 
          :page-slot="4" 
          :meta="blockTypeResult?.meta!" 
          @change="emit('pageChange', $event)" 
        />
      </template>
    </div>
    <FieldBuilder 
      ref="fieldBuilderRef" 
      :loading="submitLoading" 
      @submit="handleCreateBlockType" 
      @update:data="handleUpdateBlockType"
    />
  </n-layout-sider>
</template>
