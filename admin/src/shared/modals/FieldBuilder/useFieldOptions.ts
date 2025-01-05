import { h } from 'vue'
import { NButton, NIcon, NText } from 'naive-ui'
import type { SelectOption, SelectGroupOption } from 'naive-ui'
import type { IFieldOption } from '#/model'
import { $t } from '@/locales'
import { useFormSchemas } from './useFormSchema'

export const useFieldOptions = () => {
  const { schemaGroups, baseSchemas } = useFormSchemas()
  
  const options = {
    plainText: {
      label: $t('form.builder.type.plainText'),
      value: 'plainText',
      icon: 'i-ph-text-t-duotone',
      schemas: [
        ...schemaGroups.basic,
        baseSchemas.defaultValue,
        baseSchemas.defaultValueInput,
        baseSchemas.textarea,
        baseSchemas.localization
      ]
    },
    formattedText: {
      label: $t('form.builder.type.formattedText'),
      value: 'formattedText',
      icon: 'i-ph-text-aa-duotone',
      schemas: [
        ...schemaGroups.withDefault,
        baseSchemas.localization
      ]
    },
    date: {
      label: $t('form.builder.type.date'),
      value: 'date',
      icon: 'i-ph-calendar-duotone',
      schemas: [
        ...schemaGroups.withDefault,
        baseSchemas.time
      ]
    },
    // Pour les types simples qui n'utilisent que les champs de base
    image: {
      label: $t('form.builder.type.image'),
      value: 'image',
      icon: 'i-ph-image-duotone',
      schemas: [...schemaGroups.basic]
    },
    link: {
      label: $t('form.builder.type.link'),
      value: 'link',
      icon: 'i-ph-link-duotone'
    },
    file: {
      label: $t('form.builder.type.file'),
      value: 'file',
      icon: 'i-ph-file-duotone',
      schemas: [...schemaGroups.basic]
    },
    video: {
      label: $t('form.builder.type.video'),
      value: 'video',
      icon: 'i-ph-video-duotone',
      schemas: [...schemaGroups.basic]
    },
    number: {
      label: $t('form.builder.type.number'),
      value: 'number',
      icon: 'i-ph-list-numbers-duotone',
      schemas: [...schemaGroups.basic]
    },
    toggle: {
      label: $t('form.builder.type.toggle'),
      value: 'toggle',
      icon: 'i-ph-toggle-left-duotone',
      schemas: [...schemaGroups.basic]
    },
    option: {
      label: $t('form.builder.type.option'),
      value: 'option',
      icon: 'i-ph-list-duotone',
      schemas: [...schemaGroups.basic]
    },
    divider: {
      label: $t('form.builder.type.divider'),
      value: 'divider',
      icon: 'i-ph-minus-duotone',
      schemas: [...schemaGroups.basic]
    },
    relation: {
      label: $t('form.builder.type.relation'),
      value: 'relation',
      icon: 'i-ph-plugs-connected-duotone',
      schemas: [...schemaGroups.basic]
    },
    // Ajout du type slug avec show: false pour le masquer du popselect
    slug: {
      label: $t('form.builder.type.slug'),
      value: 'slug',
      icon: 'i-ph-code-simple-duotone',
      show: false, // Cache l'option du popselect
      schemas: [
        ...schemaGroups.slug
      ]
    },
  } as Record<string, IFieldOption>

  const popselectOptions = Object.values(options).filter(option => option.show !== false)

  const renderLabel = (option: SelectOption | SelectGroupOption) => {
    return h('div', {class: 'flex gap-2'}, [
      h(NButton, {
        type: 'primary',
        size: 'tiny',
        secondary: true,
      }, {
        icon: () => h(NIcon, {}, { default: () => h('i', { class: option.icon }) })
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
