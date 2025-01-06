<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.users')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="users" />
  </PageWrapper>
</template>

<style scoped></style>

