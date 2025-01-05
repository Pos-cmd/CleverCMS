<script setup lang="ts">
import { IBasicCollectionType } from '#/model'
import { $t } from '@/locales'
import FieldForm from '@/shared/drawers/FieldForm.vue'

const props = defineProps<{
  selectedBlock: IBasicCollectionType | undefined
}>()

const emit = defineEmits<{
  'showFieldBuilder': [data?: any]
  'toggleBlock': [id: number, isActive: boolean]
  'deleteBlock': [id: number]
}>()

const computedSelectedBlock = computed(() => props.selectedBlock)

const fieldFormRef = ref<InstanceType<typeof FieldForm> | null>(null)

interface IToggleTypeAndLabel {
  type: 'warning' | 'success'
  icon: string
  tooltip: string
}

const getToggleTypeAndLabel = (isActive: boolean | undefined): IToggleTypeAndLabel => {
  if (isActive) {
    return {
      type: 'warning',
      icon: 'i-tabler-toggle-left',
      tooltip: $t('common.actions.disable')
    }
  }
  return {
    type: 'success',
    icon: 'i-tabler-toggle-right',
    tooltip: $t('common.actions.enable')
  }
}
</script>

<template>
  <n-layout embedded >
    <PageWrapper :title="computedSelectedBlock?.name" :content="computedSelectedBlock?.description">
      <template #extra>
        <n-space v-if="computedSelectedBlock">
          <n-button type="primary" size="small" secondary @click="emit('showFieldBuilder', computedSelectedBlock)">
            <template #icon>
              <n-icon>
                <i class="i-tabler-edit"/>
              </n-icon>
            </template>
          </n-button>
          <n-tooltip v-if="computedSelectedBlock" trigger="hover">
            <template #trigger>
              <n-button 
                :type="getToggleTypeAndLabel(computedSelectedBlock.isActive).type" 
                size="small" 
                secondary 
                @click="emit('toggleBlock', computedSelectedBlock.id, !computedSelectedBlock.isActive)"
              >
                <template #icon>
                  <n-icon>
                    <i :class="getToggleTypeAndLabel(computedSelectedBlock.isActive).icon"/>
                  </n-icon>
                </template>
              </n-button>
            </template>
            {{ getToggleTypeAndLabel(computedSelectedBlock.isActive).tooltip }}
          </n-tooltip>
          <n-button 
            v-if="computedSelectedBlock"
            type="error" 
            size="small" 
            secondary 
            @click="emit('deleteBlock', computedSelectedBlock.id)"
          >
            <template #icon>
              <n-icon>
                <i class="i-tabler-trash"/>
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </template>
      <ExceptionBase type="block" :description="$t('page.blocks.items.emptyMessage', { name: computedSelectedBlock?.name })">
        <template v-if="computedSelectedBlock?.name" #extra>
          <n-button type="primary" @click="fieldFormRef?.handleOpenDrawer()">
            {{ $t('button.create.item') }}
            <template #icon>
              <n-icon>
                <i class="i-ph-stack-plus-bold"/>
              </n-icon>
            </template>
          </n-button>
        </template>
      </ExceptionBase>
      <FieldForm ref="fieldFormRef"/>
    </PageWrapper>
  </n-layout>
</template>
