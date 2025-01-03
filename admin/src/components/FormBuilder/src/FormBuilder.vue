<template>
  <n-form v-bind="getBindValue" ref="formElRef" :model="formModel" class="mt-2">
    <n-grid v-bind="getGrid">
      <template v-for="schema in getSchema" :key="schema.field">
        <n-gi v-if="getShow(schema)" v-bind="getGridItem(schema)">
          <n-form-item
            :label="schema.label"
            :path="getFormItemPath(schema.field)"
            v-bind="schema.formItemProps"
          >
            <!-- Rappel chaleureux sur le côté droit du nom de l'étiquette -->
            <template v-if="schema.subLabel || schema.labelMessage" #label>
              <div class="flex items-center">
                <n-text class="mr-2">{{ schema.label }}</n-text>
                <n-text v-if="schema.subLabel" class="mr-2 text-gray-400">{{ schema.subLabel }}</n-text>
                <n-tooltip
                  v-if="schema.labelMessage"
                  trigger="hover"
                  :style="schema.labelMessageStyle"
                >
                  <template #trigger>
                    <i-tabler-question-circle class="text-18px cursor-pointer text-$app-text-color-3" />
                  </template>
                  {{ schema.labelMessage }}
                </n-tooltip>
              </div>
            </template>

            <!-- Déterminer l'emplacement -->
            <template v-if="schema.slot">
              <slot
                :name="schema.slot"
                :model="formModel"
                :field="schema.field"
                :value="get(formModel, schema.field)"
              />
            </template>

            <!-- NCheckbox -->
            <template v-else-if="schema.component === 'NCheckbox'">
              <n-checkbox-group v-model:value="formModel[schema.field as string]">
                <n-space>
                  <n-checkbox
                    v-for="item in schema?.componentProps?.options"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </n-space>
              </n-checkbox-group>
            </template>

            <!-- NRadioGroup -->
            <template v-else-if="schema.component === 'NRadioGroup'">
              <n-radio-group v-model:value="formModel[schema.field as string]">
                <n-space v-bind="schema?.componentProps?.spaceProps">
                  <n-radio
                    v-for="item in schema?.componentProps?.options"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </template>

            <!-- NRadioButtonGroup -->
            <template v-else-if="schema.component === 'NRadioButtonGroup'">
              <n-radio-group v-model:value="formModel[schema.field as string]">
                <n-radio-button
                  v-for="item in schema?.componentProps?.options"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </n-radio-button>
              </n-radio-group>
            </template>

            <!-- NInputGroup -->
            <template v-else-if="schema.component === 'NInputGroup'">
              <n-input-group>
                <template v-for="item in schema.childrens" :key="item.filed">
                  <component
                    v-bind="getComponentProps(item)"
                    :is="getComp(item)"
                    :value="get(formModel, item.field ?? schema.field)"
                    :class="{
                      isFull: (item.isFull ?? schema.isFull) != false && getProps.isFull,
                    }"
                    @update:value="set(formModel, item.field ?? schema.field, $event)"
                  >
                    {{ item?.defaultSlot }}
                  </component>
                </template>
              </n-input-group>
            </template>

            <!-- Rendre dynamiquement les composants du formulaire -->
            <component
              v-bind="getComponentProps(schema)"
              :is="getComp(schema)"
              v-else
              :[schema.bindVal!]="get(formModel, schema.field)"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              @[schema.bindUpdateVal!]="set(formModel, schema.field, $event)"
            />

            <!-- Contenu derrière le composant -->
            <template v-if="schema.suffix">
              <slot
                :name="schema.suffix"
                :model="formModel"
                :field="schema.field"
                :value="get(formModel, schema.field)"
              />
            </template>
          </n-form-item>
        </n-gi>
      </template>
      <!-- Soumettre Réinitialiser Développer le bouton Réduire -->
      <n-gi
        v-if="getProps.showActionButtonGroup"
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        #="{ overflow }"
      >
        <n-space
          align="center"
          :justify="isInline ? 'end' : 'start'"
          :style="{
            'margin-left': `${isInline ? 12 : getProps.labelWidth}px`,
            'margin-bottom': '24px',
          }"
        >
          <n-button
            v-if="getProps.showSubmitButton"
            v-bind="getSubmitBtnOptions"
            @click="handleSubmit"
          >
            {{ getProps.submitButtonText ?? $t('component.button.save') }}
          </n-button>
          <n-button
            v-if="getProps.showResetButton"
            v-bind="getResetBtnOptions"
            @click="resetFields"
          >
            {{ getProps.resetButtonText ?? $t('component.button.reset') }}
          </n-button>
          <n-button
            v-if="isInline && getProps.showAdvancedButton"
            type="primary"
            text
            icon-placement="right"
            @click="unfoldToggle"
          >
            <template #icon>
              <n-icon v-if="overflow" size="14" class="unfold-icon">
                <i-tabler-chevron-down />
              </n-icon>
              <n-icon v-else size="14" class="unfold-icon">
                <i-tabler-chevron-up />
              </n-icon>
            </template>
            {{ overflow ? $t('form.component.expand') : $t('form.component.collapse') }}
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts">
import { useBreakpoint } from '@/composables/web/useBreakpoint'
import { $t } from '@/locales'
import { deepMerge } from '@/utils'
import { isArray, isBoolean, isFunction, isNull, isString } from '@clever/utils'
import { asyncComputed } from '@vueuse/core'
import { cloneDeep, get, set } from 'lodash-es'
import type { FormItemRule, GridItemProps, GridProps } from 'naive-ui'
import type { Ref } from 'vue'
import { componentMap } from './component_map'
import { createPlaceholderMessage, setComponentRuleType } from './helper'
import { useFormEvents } from './hooks/use_form_events'
import { useFormValues } from './hooks/use_form_values'
import { basicProps } from './props'
import type { ComponentType } from './types'
import type { FormActionType, FormProps, FormSchema } from './types/form'

export default defineComponent({
  name: 'FormBuilder',
  props: {
    ...basicProps,
  },
  emits: ['reset', 'submit', 'register'],
  setup(props, { emit, attrs }) {
    const { smaller, SizeEnum } = useBreakpoint()

    const defaultFormModel = ref<Recordable>({})
    const formModel = reactive<Recordable>({})
    // const formModel = ref<Recordable>({});
    const propsRef = ref<Partial<FormProps>>({})
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formElRef = ref<Nullable<FormActionType>>(null)
    const gridCollapsed = ref(false)
    const isUpdateDefaultRef = ref(false)
    const labelPlacementRef = asyncComputed(() => (smaller(SizeEnum.MD).value ? 'top' : 'left'))
    const getProps = computed((): FormProps => {
      const formProps = Object.assign({}, props, unref(propsRef))
      const rulesObj: any = {
        rules: {},
      }
      const schemas = formProps.schemas || []
      schemas.forEach((item) => {
        const rules = handleRules(item)
        set(rulesObj.rules, item.field, rules)
      })
      return { ...formProps, ...unref(rulesObj) }
    })

    const getContext = computed(() => {
      const { schemas } = unref(getProps)
      return {
        schemas,
        model: unref(formModel),
      }
    })

    function getFormItemPath(field: FormSchema['field']) {
      if (isArray(field))
        return field.join('.')
      else if (isString(field))
        return field
    }

    function getPlaceholderMessage(schema: FormSchema) {
      const { rulesMessageJoinLabel, label, component } = schema
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props

      const joinLabel = Reflect.has(schema, 'rulesMessageJoinLabel')
        ? rulesMessageJoinLabel
        : globalRulesMessageJoinLabel

      return `${createPlaceholderMessage(component)} ${joinLabel ? label ?? '' : ''}`
    }

    function getComp(schema: FormSchema) {
      const { component } = schema
      let componentName: ComponentType
      switch (component) {
        case 'NInputTextarea':
          componentName = 'NInput'
          break
        case 'NInputPassword':
          componentName = 'NInput'
          break
        case 'NDateRangePicker':
          componentName = 'NDatePicker'
          break
        case 'NDatetimeRangePicker':
          componentName = 'NDatePicker'
          break
        default:
          componentName = component!
      }
      return componentMap.get(componentName)
    }

    function getComponentProps(schema: FormSchema) {
      const { component, componentProps } = schema
      let preset: any = {}
      switch (component) {
        case null:
        case undefined:
          break
        case 'NInputTextarea':
          preset = {
            type: 'textarea',
          }
          break
        case 'NInputPassword':
          preset = {
            type: 'password',
          }
          break
        case 'NDateRangePicker':
          preset = {
            type: 'daterange',
          }
          break
        case 'NDatetimeRangePicker':
          preset = {
            type: 'datetimerange',
          }
          break
      }

      const compProps = componentProps ?? {}
      return {
        clearable: true,
        placeholder: getPlaceholderMessage(schema),
        disabled: getDisabled(schema),

        ...preset,
        ...compProps,
      }
    }

    function getDisabled(schema: FormSchema): boolean {
      const { disabled } = schema
      const { disabled: globalDisabled } = unref(getProps)

      return isFunction(disabled)
        ? disabled(getContext.value)
        : disabled ?? globalDisabled ?? false
    }

    function getShow(schema: FormSchema): boolean {
      const { show = true } = schema
      if (isFunction(show))
        return show(getContext.value)

      return show
    }

    const getResetBtnOptions = computed(() => {
      return Object.assign(
        {
          size: props.size,
          type: 'default',
        },
        propsRef.value.resetButtonOptions,
      )
    })

    const getSubmitBtnOptions = computed(() => {
      return Object.assign(
        {
          size: props.size,
          type: 'primary',
        },
        propsRef.value.submitButtonOptions,
      )
    })

    const isInline = computed(() => {
      return unref(getProps).inline
    })

    const getGrid = computed((): GridProps => {
      const { gridProps } = unref(getProps)
      return {
        responsive: 'screen',
        collapsed: isInline.value ? gridCollapsed.value : false,
        cols: 1,
        ...gridProps,
      }
    })

    function getGridItem(schema: FormSchema): GridItemProps {
      const { giProps } = schema
      const { giProps: globalGiProps } = unref(getProps)
      return {
        span: 1,
        ...globalGiProps,
        ...giProps,
      }
    }

    const getBindValue = computed(() => {
      const { labelPlacement, ...Props } = unref(getProps)
      return {
        ...attrs,
        ...props,
        ...Props,
        labelPlacement: labelPlacement ?? labelPlacementRef.value,
      } as Recordable
    })

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any)
      for (const schema of schemas) {
        const { defaultValue, bindVal = 'value', bindUpdateVal = 'update:value' } = schema
        // handle date type
        // dateItemType.includes(component as string)
        schema.bindVal = bindVal
        schema.bindUpdateVal = bindUpdateVal
        if (defaultValue)
          schema.defaultValue = defaultValue
      }
      return schemas as FormSchema[]
    })

    const { handleFormValues, initDefault } = useFormValues({
      defaultFormModel,
      getSchema,
      formModel,
    })

    const { handleSubmit, validate, resetFields, getFieldsValue, clearValidate, setFieldsValue }
        = useFormEvents({
          emit,
          getProps,
          formModel,
          getSchema,
          formElRef: formElRef as Ref<FormActionType>,
          defaultFormModel,
          handleFormValues,
        })

    function unfoldToggle() {
      gridCollapsed.value = !gridCollapsed.value
    }

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
    }

    function handleRules(schema: FormSchema): FormItemRule[] {
      const {
        rules: defRules = [],
        show,
        required,
        component,
        // componentProps,
        // dynamicRules,
      } = schema

      // if (isFunction(dynamicRules)) {
      //   return dynamicRules(unref(getValues)) as ValidationRule[];
      // }

      let rules = cloneDeep(defRules) as FormItemRule[]
      const defaultTrigger = ['blur', 'input']
      const defaultMsg = getPlaceholderMessage(schema)

      function validator(rule: any, value: any) {
        const msg = rule.message || defaultMsg
        if (value === undefined || isNull(value)) {
          // valeur nulle
          return Promise.reject(msg)
        }
        if (Array.isArray(value) && value.length === 0) {
          // type de tableau
          return Promise.reject(msg)
        }
        if (typeof value === 'string' && value.trim() === '') {
          // chaîne vide
          return Promise.reject(msg)
        }
        if (
          typeof value === 'object'
            && Reflect.has(value, 'checked')
            && Reflect.has(value, 'halfChecked')
            && Array.isArray(value.checked)
            && Array.isArray(value.halfChecked)
            && value.checked.length === 0
            && value.halfChecked.length === 0
        ) {
          // Composant arborescent pour la sélection non associative
          return Promise.reject(msg)
        }
        return Promise.resolve()
      }

      // const getRequired = isFunction(required) ? required(unref(getValues)) : required;

      if ((!rules || rules.length === 0) && required)
        rules = [{ required, validator, trigger: defaultTrigger }]

      const requiredRuleIndex: number = rules.findIndex(
        rule => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
      )

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex]
        if (isBoolean(show) && !show)
          rule.required = false

        if (component) {
          if (!Reflect.has(rule, 'type'))
            setComponentRuleType(rule, component)

          rule.message = rule.message || defaultMsg
          rule.trigger = defaultTrigger

          if (component.includes('NInput'))
            rule.whitespace = true
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex(val => val.max)
      if (characterInx !== -1 && !rules[characterInx].validator) {
        rules[characterInx].message
            = rules[characterInx].message
            || $t('component.form.maxTip', [rules[characterInx].max] as Recordable)
      }
      return rules
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      validate,
      clearValidate,
      setProps,
      submit: handleSubmit,
    }

    watch(
      () => getSchema.value,
      (schema) => {
        if (unref(isUpdateDefaultRef))
          return

        if (schema?.length) {
          initDefault()
          isUpdateDefaultRef.value = true
        }
      },
    )

    watch(
      () => unref(getProps).model,
      (val) => {
        if (!val)
          return
        setFieldsValue(val)
      },
      {
        immediate: true,
      },
    )

    onMounted(() => {
      initDefault()
      emit('register', formActionType)
    })

    return {
      $t,
      get,
      set,
      formElRef,
      formModel,
      getGrid,
      getGridItem,
      getProps,
      getShow,
      getFormItemPath,
      getBindValue,
      getSchema,
      getSubmitBtnOptions,
      getResetBtnOptions,
      handleSubmit,
      resetFields,
      isInline,
      getComponentProps,
      getComp,
      unfoldToggle,
      componentMap,
    }
  },
})
</script>

<style lang="less" scoped>
  .isFull {
    flex: 1;
  }

  .unfold-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -3px;
  }
</style>
