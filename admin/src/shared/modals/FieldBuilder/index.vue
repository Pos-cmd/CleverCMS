<script setup lang="ts">
import type { IBasicCollectionType, IField, IFieldOption } from '#/model';
import EditableText from '@/components/EditableText.vue';
import type { FormSchema } from '@/components/FormBuilder';
import { useNaiveHelper } from '@/composables/web/useNaiveHelper';
import { $t } from '@/locales';
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption, NButton, NIcon, NText, SelectGroupOption, SelectOption } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';
import { useModal } from './useModal'
import { useFields } from './useFields'
// import { useFormSchemas } from './useFormSchema';
// import { useFieldOptions } from './useFieldOptions'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits(['update:fields', 'submit', 'cancel', 'update:data'])

const { renderIcon } = useNaiveHelper()

/**
 * Génère les options du menu dropdown en tenant compte des propriétés
 * canBeDeleted et canBeDuplicate du champ
 * @param field - Le champ pour lequel générer les options
 */
const getFieldDropdownOptions = (field: IField) => {
  return [
    {
      label: $t('button.duplicate'),
      key: 'duplicate',
      icon: () => renderIcon('i-tabler-copy'),
      disabled: !field.canBeDuplicate,
    },
    {
      label: $t('button.delete'),
      key: 'delete',
      icon: () => renderIcon('i-tabler-trash text-error'),
      disabled: !field.canBeDeleted
    }
  ] as Array<DropdownOption | DropdownGroupOption | DropdownDividerOption | DropdownRenderOption>
}

const useFormSchemas = () => {
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
      component: 'NInput',
      label: $t('form.description'),
      componentProps: {
        type: 'textarea',
      },
      formItemProps: { class: 'mb-3' }
    },
    required: {
      field: 'required',
      component: 'SwitchTab',
      label: $t('form.isRequired'),
      componentProps: {
        modelValue: 'false',
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

const useFieldOptions = () => {
  const { schemaGroups, baseSchemas } = useFormSchemas()
  const { renderIcon } = useNaiveHelper()
  
  const options = {
    plainText: {
      label: $t('form.builder.type.plainText'),
      value: 'plainText',
      icon: 'i-ph-text-t-duotone',
      getComponent: (config: any) => config.textarea === 'true' ? 'NInputTextarea' : 'NInput',
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
      icon: 'i-ph-list-numbers-duotone',
      component: 'NInputNumber',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    select: {
      label: $t('form.builder.type.select'),
      value: 'select',
      icon: 'i-ph-list-duotone',
      component: 'NSelect',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    switch: {
      label: $t('form.builder.type.switch'),
      value: 'switch',
      icon: 'i-ph-toggle-left-duotone',
      component: 'NSwitch',
      schemas: [
        ...schemaGroups.basic
      ]
    },
    datePicker: {
      label: $t('form.builder.type.date'),
      value: 'datePicker',
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
      icon: 'i-ph-clock-duotone',
      component: 'NTimePicker',
      schemas: [
        ...schemaGroups.withDefault
      ]
    },
    colorPicker: {
      label: $t('form.builder.type.color'),
      value: 'colorPicker',
      icon: 'i-ph-paint-brush-duotone',
      component: 'NColorPicker',
      schemas: [
        ...schemaGroups.withDefault
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

  const popselectOptions = Object.values(options)
    .filter(option => !option.hidden)
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

// Composition des composables
const { showModal, modalTitle, titleInputRef, handleShowModal, handleSubmit, handleCancel, formData } = useModal(emit)
const { fields, currentField, handleSelectFieldDropdown, handleAddField, handleSelectField, handleUpdateConfig } = useFields(emit)
const { options, popselectOptions, renderLabel } = useFieldOptions()

const fieldList = computed(() => Object.values(fields.value))

// Exposer les méthodes nécessaires
defineExpose({
  handleShowModal
})
</script>

<template>
  <n-modal v-model:show="showModal" :closable="false" preset="card" content-class="!pb-0" class="!w-[40rem]">
    <template #header>
      <EditableText
        v-model="modalTitle"
        ref="titleInputRef"
        container-class="!w-10rem"
        text-class="text-base font-medium"
        input-class="modal-title-input"
      />
    </template>
    <template #header-extra>
      <n-popselect :render-label="renderLabel" size="small" trigger="click" :options="popselectOptions" @update:value="handleAddField">
        <n-button type="primary" secondary>
          {{ $t('common.actions.add') }}
          <template #icon>
            <n-icon>
              <i class="i-tabler-text-plus text-xl"/>
            </n-icon>
          </template>
        </n-button>
      </n-popselect>
    </template>
    <div>
      <n-input 
        v-model:value="formData.description"
        type="textarea" 
        size="small" 
        :placeholder="$t('form.description')" 
        class="w-full mb-2"
      />
    </div>
    <n-layout has-sider style="height: 20rem">
      <n-layout-sider bordered width="16rem" content-style="padding-inline: 12px; padding-block: 12px">
        <VueDraggable v-if="fields.length" v-model="fieldList" :animation="150" filter=".none_draggable">
          <div v-for="field in fields" :key="field.order" class="h-36px cursor-pointer flex flex-items-center flex-justify-between px-2 my-1 rd-4px transition duration-500 hover:(bg-primary bg-opacity-10)" :class="{'bg-primary bg-opacity-20': field.order == currentField?.order}" @click="handleSelectField(field)">
            <div class="flex-y-center gap-2">
              <n-button type="primary" secondary size="tiny" class="none_draggable">
                <template #icon>
                  <n-icon>
                    <i :class="options[field.type]?.icon"/>
                  </n-icon>
                </template>
              </n-button>
              <span >{{ field.config.title }}</span>
            </div>
            <n-dropdown placement="right" :options="getFieldDropdownOptions(field)" @select="(key) => handleSelectFieldDropdown(key, field)">
              <n-icon class="cursor-move">
                <i class="i-tabler-grip-vertical"/>
              </n-icon>
            </n-dropdown>
          </div>
        </VueDraggable>
      </n-layout-sider>
      <n-layout content-style="padding: 24px">
        <FormBuilder v-if="currentField" 
          :schemas="currentField.schemas"
          :model="currentField.config"
          size="small"
          label-placement="left"
          :show-action-button-group="false"
          :show-feedback="false"
          :label-width="120"
          @update:model="(value) => handleUpdateConfig(currentField as IField, value)"
        />
      </n-layout>
    </n-layout>
    <template #action>
      <n-space justify="end" class="gap-2">
        <n-button type="primary" :loading secondary @click="handleCancel">
          {{ $t('button.cancel') }}
        </n-button>
        <n-button type="primary" :loading @click="handleSubmit">
          {{ $t('button.save') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<style scoped>
.modal-title-input :deep(.n-input__input-el) {
  font-size: 1rem;
  font-weight: 500;
}
</style>
