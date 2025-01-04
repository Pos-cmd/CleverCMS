<script setup lang="ts">
import { $t } from '@/locales'
</script>

<template>
  <PageWrapper :title="$t('route.notification')" content="Voici le contenue" :is-title-bottom-back="true">
    <ExceptionBase type="notification" :description="$t('page.notification.emptyMessage')"/>
  </PageWrapper>
</template>

<style scoped></style>
