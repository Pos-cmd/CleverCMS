<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.permissions')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="permission" />
  </PageWrapper>
</template>

<style scoped></style>
