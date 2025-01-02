<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.roles')" content="Page des roles" :is-title-bottom-back="true">
    <ExceptionBase type="maintenance" />
    <template #rightFooter>
      left
    </template>
  </PageWrapper>
</template>

<style scoped></style>
