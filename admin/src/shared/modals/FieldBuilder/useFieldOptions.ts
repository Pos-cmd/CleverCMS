import { h } from 'vue'
import { NButton, NIcon, NText } from 'naive-ui'
import type { SelectOption, SelectGroupOption } from 'naive-ui'
import type { IFieldOption } from '#/model'
import { $t } from '@/locales'
import { useFormSchemas } from './useFormSchema'
import { useNaiveHelper } from '@/composables/web/useNaiveHelper'

export const useFieldOptions = () => {
  const { schemaGroups, baseSchemas } = useFormSchemas()
  const { renderIcon } = useNaiveHelper()
  
  const options = {
    plainText: {
      label: $t('form.builder.type.plainText'),
      value: 'plainText',
      field: 'plainText',
      icon: 'i-ph-text-t-duotone',
      component: 'NInput',
      schemas: [
        ...schemaGroups.basic,
        baseSchemas.defaultValue,
        baseSchemas.defaultValueInput,
        baseSchemas.textarea,
        baseSchemas.localization
      ]
    },
    inputNumber: {
      label: $t('form.builder.type.number'),
      value: 'inputNumber',
      field: 'inputNumber',
      icon: 'i-ph-list-numbers-duotone',
      component: 'NInputNumber',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    select: {
      label: $t('form.builder.type.select'),
      value: 'select',
      field: 'select',
      icon: 'i-ph-list-duotone',
      component: 'NSelect',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    switch: {
      label: $t('form.builder.type.switch'),
      value: 'switch',
      field: 'switch',
      icon: 'i-ph-toggle-left-duotone',
      component: 'NSwitch',
      schemas: [
        ...schemaGroups.basic
      ]
    },
    datePicker: {
      label: $t('form.builder.type.date'),
      value: 'datePicker',
      field: 'datePicker',
      icon: 'i-ph-calendar-duotone',
      component: 'NDatePicker',
      schemas: [
        ...schemaGroups.withDefault,
        baseSchemas.time
      ]
    },
    timePicker: {
      label: $t('form.builder.type.time'),
      value: 'timePicker',
      field: 'timePicker',
      icon: 'i-ph-clock-duotone',
      component: 'NTimePicker',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    colorPicker: {
      label: $t('form.builder.type.color'),
      value: 'colorPicker',
      field: 'colorPicker',
      icon: 'i-ph-paint-brush-duotone',
      component: 'NColorPicker',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    image: {
      label: $t('form.builder.type.image'),
      value: 'image',
      field: 'image',
      icon: 'i-ph-image-duotone',
      schemas: [...schemaGroups.basic]
    },
    link: {
      label: $t('form.builder.type.link'),
      value: 'link',
      field: 'link',
      icon: 'i-ph-link-duotone'
    },
    file: {
      label: $t('form.builder.type.file'),
      value: 'file',
      field: 'file',
      icon: 'i-ph-file-duotone',
      schemas: [...schemaGroups.basic]
    },
    video: {
      label: $t('form.builder.type.video'),
      value: 'video',
      field: 'video',
      icon: 'i-ph-video-duotone',
      schemas: [...schemaGroups.basic]
    },
    divider: {
      label: $t('form.builder.type.divider'),
      value: 'divider',
      field: 'divider',
      icon: 'i-ph-minus-duotone',
      schemas: [...schemaGroups.basic]
    },
    relation: {
      label: $t('form.builder.type.relation'),
      value: 'relation',
      field: 'relation',
      icon: 'i-ph-plugs-connected-duotone',
      schemas: [...schemaGroups.basic]
    },
    slug: {
      label: $t('form.builder.type.slug'),
      value: 'slug',
      field: 'slug',
      icon: 'i-ph-code-simple-duotone',
      show: false, // Cache l'option du popselect
      schemas: [
        ...schemaGroups.slug
      ]
    },
  } as Record<string, IFieldOption>

  const popselectOptions = Object.values(options)
    .filter(option => !option.show !== false)
    .map(option => ({
      label: option.label,
      value: option.value,
      icon: option.icon
    }))

  const renderLabel = (option: SelectOption | SelectGroupOption) => {
    return h('div', {class: 'flex gap-2'}, [
      h(NButton, {
        type: 'primary',
        size: 'tiny',
        secondary: true,
      }, {
        // icon: () => h(NIcon, {}, { default: () => h('i', { class: option.icon }) })
        icon: () => renderIcon(option.icon as string)
      }),
      h(NText, {}, () => option.label)
    ])
  }

  return {
    options,
    popselectOptions,
    renderLabel
  }
}
