<script setup lang="ts">
import { IBasicCollectionType } from '#/model'
import { $t } from '@/locales'

const props = defineProps<{
  selectedBlock: IBasicCollectionType | undefined
}>()
</script>

<template>
  <n-layout embedded>
    <PageWrapper :title="selectedBlock?.name" :content="selectedBlock?.description">
      <ExceptionBase type="block" :description="$t('page.blocks.items.emptyMessage', { name: selectedBlock?.name })">
        <template v-if="selectedBlock?.name" #extra>
          <n-button type="primary" @click="$emit('create')">
            {{ $t('button.create.item') }}
            <template #icon>
              <n-icon>
                <i class="i-ph-stack-plus-bold"/>
              </n-icon>
            </template>
          </n-button>
        </template>
      </ExceptionBase>
    </PageWrapper>
  </n-layout>
</template>
