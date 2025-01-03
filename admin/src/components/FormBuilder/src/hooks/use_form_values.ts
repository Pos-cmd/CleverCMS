import { isArray, isFunction, isNullOrUnDef, isObject, isString } from '@clever/utils'
import { set } from 'lodash-es'
import type { ComputedRef, Ref } from 'vue'
import type { FormSchema } from '../types/form.js'

interface UseFormValuesContext {
  defaultFormModel: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
}
export function useFormValues({ defaultFormModel, getSchema, formModel }: UseFormValuesContext) {
  // traitement form values
  function handleFormValues(values: Recordable) {
    if (!isObject(values)) return {}

    const res: Recordable = {}
    for (const item of Object.entries(values)) {
      let [, value] = item
      const [key] = item
      if (
        !key ||
        (isArray(value) && value.length === 0) ||
        isFunction(value) ||
        isNullOrUnDef(value)
      )
        continue

      // Supprimer les espaces
      if (isString(value)) value = value.trim()

      set(res, key, value)
    }
    return res
  }

  // Initialisation des valeurs par défaut
  function initDefault() {
    const schemas = unref(getSchema)
    const obj: Recordable = {}
    const handle = (formSchemas: FormSchema[]) => {
      formSchemas.forEach((item) => {
        const { defaultValue, childrens } = item
        if (!isNullOrUnDef(defaultValue)) {
          set(obj, item.field, defaultValue)
          set(formModel, item.field, defaultValue)
        }
        if (childrens && childrens?.length > 0) handle(childrens)
      })
    }
    handle(schemas)
    defaultFormModel.value = obj
  }

  return { handleFormValues, initDefault }
}
