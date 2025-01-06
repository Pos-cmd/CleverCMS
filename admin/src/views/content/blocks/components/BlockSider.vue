<script setup lang="ts">
import { IBasicCollectionType } from '#/model'
import { useNaiveHelper } from '@/composables/web/useNaiveHelper'
import { $t } from '@/locales'
import { API } from '@/services/api'
import type { IStoreBlockTypeParams, IUpdateBlockTypeParams } from '@/services/api/content_management/block/types'
import MetaPagination from '@/shared/MetaPagination/index.vue'

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
  'showFieldBuilder': [data?: any]
  'toggleBlock': [id: number, isActive: boolean]
  'deleteBlock': [id: number]
}>()

const { renderIcon } = useNaiveHelper()

const getDropdownOptions = (isActive: boolean) => [
  {
    label: $t('button.edit'),
    key: 'edit',
    icon: () => renderIcon('i-tabler-edit')
  },
  {
    label: isActive ? $t('common.actions.disable') : $t('common.actions.enable'),
    key: 'toggleActive',
    icon: () => renderIcon(isActive ? 'i-tabler-toggle-left' : 'i-tabler-toggle-right')
  },
  {
    label: $t('button.delete'),
    key: 'delete',
    icon: () => renderIcon('i-tabler-trash')
  }
]

const getDropdownOptionForItem = (item: IBasicCollectionType) => getDropdownOptions(item.isActive)

const hasBlocks = computed(() => props.blockTypeResult?.data?.length !== 0)


const handleDropdownSelect = async (key: 'edit' | 'toggleActive' | 'delete', data: IBasicCollectionType) => {
  switch (key) {
    case 'edit':
      emit('showFieldBuilder', data)
      break
    case 'toggleActive':
      emit('toggleBlock', data.id, !data.isActive)
      break
    case 'delete':
      emit('deleteBlock', data.id)
      break
  }
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
          <n-button type="primary" size="tiny" secondary @click="emit('showFieldBuilder')">
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
                  :options="getDropdownOptionForItem(item)" 
                  trigger="click" 
                  @select="(key) => handleDropdownSelect(key, item)"
                >
                  <n-button size="tiny" quaternary :render-icon="() => renderIcon('i-tabler-dots')" />
                </n-dropdown>
              </div>
            </n-list-item>
            <n-list-item @click="emit('showFieldBuilder')">
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
          @changePage="emit('pageChange', $event)" 
        />
      </template>
    </div>
  </n-layout-sider>
</template>
