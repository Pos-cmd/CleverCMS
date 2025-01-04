<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.sections')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="section" :description="$t('page.sections.emptyMessage')">
      <template #extra>
        <n-button type="primary">
          {{ $t('button.create.sections') }}
          <template #icon>
            <n-icon>
              <i class="i-tabler-layout-grid-add"></i>
            </n-icon>
          </template>
        </n-button>
      </template>
    </ExceptionBase>
  </PageWrapper>
</template>

<style scoped></style>
