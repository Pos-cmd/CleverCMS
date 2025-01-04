<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.account')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="account" />
  </PageWrapper>
</template>

<style scoped></style>

