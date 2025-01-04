<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.home')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="maintenance" />
  </PageWrapper>
</template>

<style scoped></style>
