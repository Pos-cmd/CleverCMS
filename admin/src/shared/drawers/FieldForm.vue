<script setup lang="ts">
import { FormSchema } from '@/components/FormBuilder';

const showDrawer = ref(false)
const formData = ref({})

const schemas = ref<FormSchema[]>([])

const handleOpenDrawer = (formSchemas: FormSchema[]) => {
  showDrawer.value = true
  schemas.value = formSchemas
}

defineExpose({
  showDrawer,
  handleOpenDrawer
})
</script>

<template>
   <n-drawer v-model:show="showDrawer" :width="502">
    <n-drawer-content title="Stoner">
      <!-- <pre>{{ schemas }}</pre> -->
      <FormBuilder :schemas :showActionButtonGroup="false"/>
      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="showDrawer = false">{{ $t('button.save') }}</n-button>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
