<script setup lang="ts">
import { $t } from '@/locales';
import FieldBuilder from '@/shared/modals/FieldBuilder.vue';

const fieldBuilderRef = ref<InstanceType<typeof FieldBuilder> | null>(null)
</script>

<template>
  <PageWrapper>
    <n-layout has-sider position="absolute" style="height: 100%;">
      <n-layout-sider bordered content-style="padding: 24px;" content-class="flex-center">
        <n-empty :description="$t('page.blocks.emptyMessage')">
          <template #extra>
            <n-button type="primary" secondary @click="fieldBuilderRef?.handleShowModal()">
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
      </n-layout-sider>
      <n-layout embedded>
        <PageWrapper>
          <ExceptionBase type="block" :description="$t('page.blocks.emptyMessage')">
            <template #extra>
              <n-button type="primary" @click="fieldBuilderRef?.handleShowModal()">
                {{ $t('button.create.blocks') }}
                <template #icon>
                  <n-icon>
                    <i class="i-ph-stack-plus-bold"></i>
                  </n-icon>
                </template>
              </n-button>
            </template>
          </ExceptionBase>
        </PageWrapper>
      </n-layout>
    </n-layout>
    <FieldBuilder ref="fieldBuilderRef" />
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
