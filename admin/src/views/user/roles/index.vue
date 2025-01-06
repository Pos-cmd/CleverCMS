<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.roles')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="role" />
  </PageWrapper>
</template>

<style scoped></style>
