<script setup lang="ts">
import { $t } from '@/locales'

const handleClick = () => {
  window.$toast.success('click')
}
</script>

<template>
  <PageWrapper :title="$t('route.home')" content="Voici le contenue" :is-title-bottom-back="true">
    <n-button type="primary" @click="handleClick">Go to home</n-button>
    <ExceptionBase type="maintenance" />
    <template #rightFooter>
      left
    </template>
  </PageWrapper>
</template>

<style scoped></style>
