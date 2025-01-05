import type { FormSchema } from '@/components/FormBuilder'
import { $t } from '@/locales'

export const useFormSchemas = () => {
  // Schémas de base réutilisables
  const baseSchemas = {
    title: {
      field: 'title',
      component: 'NInput',
      label: $t('form.title'),
      required: true,
      formItemProps: { class: 'mb-3' },
    },
    description: {
      field: 'description',
      component: 'NInputTextarea',
      label: $t('form.description'),
      formItemProps: { class: 'mb-3' }
    },
    required: {
      field: 'required',
      component: 'SwitchTab',
      label: $t('form.isRequired'),
      // required: true,
      componentProps: {
        modelValue: 'true',
        size: 'small',
        tabs: [
          { value: 'true', label: $t('common.yes') },
          { value: 'false', label: $t('common.no') },
        ],
      },
      formItemProps: { class: 'mb-3' }
    },
    defaultValue: {
      field: 'default',
      component: 'SwitchTab',
      label: $t('form.value'),
      componentProps: {
        modelValue: 'none',
        size: 'small',
        tabs: [
          { value: 'none', label: $t('common.none') },
          { value: 'default', label: $t('common.byDefault') },
        ],
      },
      formItemProps: { class: 'mb-3' }
    },
    defaultValueInput: {
      field: 'defaultValue',
      component: 'NInput',
      label: ' ',
      formItemProps: { class: 'mb-3' },
      show: ({ model }) => model.default === 'default',
    },
    localization: {
      field: 'localization',
      component: 'SwitchTab',
      label: $t('form.multiLang'),
      componentProps: {
        modelValue: 'false',
        size: 'small',
        tabs: [
          { value: 'false', label: $t('common.no') },
          { value: 'true', label: $t('common.yes') },
        ],
      },
      formItemProps: { class: 'mb-3' }
    },
    textarea: {
      field: 'textarea',
      component: 'SwitchTab',
      label: $t('form.textarea'),
      componentProps: {
        modelValue: 'false',
        size: 'small',
        tabs: [
          { value: 'false', label: $t('common.no') },
          { value: 'true', label: $t('common.yes') },
        ],
      },
      formItemProps: { class: 'mb-3' }
    },
    time: {
      field: 'time',
      component: 'SwitchTab',
      label: $t('form.time'),
      componentProps: {
        modelValue: 'false',
        size: 'small',
        tabs: [
          { value: 'false', label: $t('common.no') },
          { value: 'true', label: $t('common.yes') },
        ],
      },
      formItemProps: { class: 'mb-3' }
    },
    // Ajout du schéma pour le baseField
    baseField: {
      field: 'baseField',
      component: 'NSelect',
      label: $t('form.baseField'),
      required: true,
      componentProps: {
        options: [], // Sera rempli dynamiquement
        filterable: true,
      },
      formItemProps: { class: 'mb-3' }
    }
  } as Record<string, FormSchema>

  // Groupes de schémas prédéfinis
  const basicGroup = [baseSchemas.title, baseSchemas.description, baseSchemas.required]
  const schemaGroups = {
    basic: basicGroup,
    withDefault: [
      ...basicGroup,
      baseSchemas.defaultValue,
      baseSchemas.defaultValueInput
    ],
    withLocalization: [
      ...basicGroup,
      baseSchemas.localization
    ],
    withTextarea: [
      ...basicGroup,
      baseSchemas.textarea
    ],
    slug: [
      baseSchemas.title,
      baseSchemas.description,
      baseSchemas.required,
      baseSchemas.baseField
    ]
  }

  return {
    baseSchemas,
    schemaGroups
  }
}
