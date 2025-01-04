<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.setting')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="setting" />
  </PageWrapper>
</template>

<style scoped></style>
