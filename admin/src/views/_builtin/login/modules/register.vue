<script setup lang="ts">
import { useCaptcha } from '@/composables/web/useCaptcha';
import { useFormRules, useNaiveForm } from '@/composables/web/useFormRules';
import { useRouterPush } from '@/composables/web/useRouterPush';
import { $t } from '@/locales';
import { RegisterParams } from '@/services/api/auth/types';
import { useAuthStore } from '@/stores/modules/auth';
import { computed, reactive } from 'vue';

defineOptions({
  name: 'Register'
});

const { toggleLoginModule } = useRouterPush();
const authStore = useAuthStore();
const { formRef, validate } = useNaiveForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

const model: RegisterParams = reactive({
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: ''
});

const rules = computed<Record<keyof RegisterParams, App.Global.FormRule[]>>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    email: formRules.email,
    firstname: formRules.firstname,
    lastname: formRules.lastname,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  await validate();
  // request to register
  authStore.register(model);
}
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <n-grid cols="4" x-gap="12" y-gap="12">
      <NFormItemGi span="2" path="firstname">
        <NInput v-model:value="model.firstname" :placeholder="$t('page.login.common.firstnamePlaceholder')" />
      </NFormItemGi>
      <NFormItemGi span="2" path="lastname">
        <NInput v-model:value="model.lastname" :placeholder="$t('page.login.common.lastnamePlaceholder')" />
      </NFormItemGi>
    </n-grid>
    <NFormItem path="email">
      <NInput v-model:value="model.email" :placeholder="$t('page.login.common.emailPlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="confirmPassword">
      <NInput
        v-model:value="model.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
      />
    </NFormItem>
    <NSpace vertical :size="18" class="w-full">
      <NButton type="primary" size="large" round block @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
        {{ $t('page.login.common.back') }}
      </NButton>
    </NSpace>
  </NForm>
</template>

<style scoped></style>
