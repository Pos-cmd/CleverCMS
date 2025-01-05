<script setup lang="ts">
const showDrawer = ref(false)

const handleOpenDrawer = () => {
  showDrawer.value = true
}

defineExpose({
  showDrawer,
  handleOpenDrawer
})
</script>

<template>
   <n-drawer v-model:show="showDrawer" :width="502">
    <n-drawer-content title="Stoner">
      Stoner is a 1965 novel by the American writer John Williams.
    </n-drawer-content>
  </n-drawer>
</template>
