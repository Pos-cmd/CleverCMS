import { isFunction } from '@clever/utils'
import { get, isArray, isObject, merge, update } from 'lodash-es'
import type { ComputedRef, Ref } from 'vue'
import type { FormActionType, FormProps, FormSchema } from '../types/form.js'

declare type EmitType = (event: string, ...args: any[]) => void

interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  formElRef: Ref<FormActionType>
  defaultFormModel: Recordable
  handleFormValues: Function
}

export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  formElRef,
  defaultFormModel,
  handleFormValues,
}: UseFormActionContext) {
  // 验证
  async function validate() {
    return unref(formElRef)?.validate()
  }

  // 提交
  async function handleSubmit(e?: Event): Promise<Recordable<any> | boolean | void> {
    e && e.preventDefault()
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc(formModel)
      return
    }
    const formEl = unref(formElRef)
    if (!formEl) return
    try {
      await validate()
      emit('submit', formModel)
      return formModel
    } catch (error) {
      return false
    }
  }

  // 清空校验
  async function clearValidate() {
    // @ts-expect-error
    await unref(formElRef)?.restoreValidation()
  }

  // 重置
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)
    if (!formEl) return

    unref(getSchema).forEach((item) => {
      update(formModel, item.field, () => {
        return get(defaultFormModel.value, item.field) || null
      })
    })

    await clearValidate()
    const fromValues = handleFormValues(formModel)
    emit('reset', fromValues)
    submitOnReset && (await handleSubmit())
  }

  // 获取表单值
  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return handleFormValues(formModel)
  }

  // 设置表单字段值
  async function setFieldsValue<T extends Recordable>(values: T): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => {
        return isArray(item.field) ? item.field[0] : item.field
      })
      .filter(Boolean)

    Object.keys(values).forEach((key) => {
      const value = values[key]
      if (fields.includes(key))
        formModel[key] = isObject(value) ? merge(formModel[key], value) : value
    })
  }

  return {
    handleSubmit,
    validate,
    resetFields,
    getFieldsValue,
    clearValidate,
    setFieldsValue,
  }
}
