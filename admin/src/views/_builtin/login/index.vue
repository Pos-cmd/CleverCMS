<script setup lang="ts">
import { FormItemRule } from 'naive-ui'
import { useFormRules, useNaiveForm } from '@/composables/web/useFormRules'
import { t } from '@/locales'
import { LoginParams } from '@/services/api/auth/types'
import { useAuthStore } from '@/stores/modules/auth'

defineOptions({
  name: 'LoginPage',
})

const { login } = useAuthStore()
const { formRef, validate } = useNaiveForm()

const loginParams = reactive<LoginParams>({
  email: '',
  password: '',
})

//@ts-expect-error
const rules = computed<Record<keyof Omit<LoginParams, 'goHome'>, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules()

  return {
    username: formRules.username as FormItemRule,
    password: formRules.pwd as FormItemRule,
  }
})

async function handleSubmit() {
  try {
    await validate()
    const userInfo = await login(loginParams)

    window?.$notification?.success({ content: `Bienvenue ${userInfo?.firstname}`, duration: 3000 })
  } catch(error: any) {
    console.log({ error })
  }
}
</script>

<template>
  <AuthLayout>
    <div class="h-full px-4 py-10 text-center text-gray-700 dark:text-gray-200">
      <div class="text-4xl">
        <div class="inline-block i-il-logo" />
      </div>
      <p>
        <a rel="noreferrer" href="https://github.com/pos-cmd/vue-starter" target="_blank">
          {{ t('system.title') }}
        </a>
      </p>
      <p>
        <em class="text-sm opacity-75">{{ t('sys.app.desc') }}</em>
      </p>
  
      <div class="py-4" />
  
      <NSpace justify="center">
        <NForm
          ref="formRef"
          :model="loginParams"
          :label-width="80"
          :rules="rules"
          size="large"
          class="text-center w-250px!"
        >
          <NFormItem :label="t('sys.login.email')" path="email">
            <NInput v-model:value="loginParams.email" :placeholder="t('sys.login.emailPlaceholder')" />
          </NFormItem>
          <NFormItem :label="t('sys.login.password')" path="password">
            <NInput v-model:value="loginParams.password" show-password-on="mousedown" :placeholder="t('sys.login.passwordPlaceholder')" type="password" />
          </NFormItem>
        </NForm>
      </NSpace>
  
      <div>
        <n-button
          class="m-3 text-sm btn"
          type="primary"
          :disabled="(!loginParams?.email && !loginParams?.password)"
          @click="handleSubmit"
        >
          {{ t('sys.login.loginButton') }}
        </n-button>
      </div>
      <TheFooter />
    </div>
  </AuthLayout>
</template>

<style scoped>

</style>
