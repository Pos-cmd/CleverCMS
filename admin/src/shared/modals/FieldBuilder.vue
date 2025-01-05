<script setup lang="ts">
import type { IBasicCollectionType, IField, IFieldConfig, IFieldOption } from '#/model';
import EditableText from '@/components/EditableText.vue';
import type { FormSchema } from '@/components/FormBuilder';
import { useNaiveHelper } from '@/composables/web/useNaiveHelper';
import { $t } from '@/locales';
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption, NButton, NIcon, NText, type SelectGroupOption, type SelectOption } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';

const mode = ref<'create' | 'update'>('create')
const formData = ref<IBasicCollectionType>({
  id: 0,
  name: '',
  description: '',
  fields: [],
  isActive: true,
  createdAt: '',
  updatedAt: ''
})

const { loading } = withDefaults(defineProps<{
  loading?: boolean
}>(), {
  loading: false
})

const emit = defineEmits(['update:fields', 'submit', 'cancel', 'update:data'])

const { renderIcon } = useNaiveHelper()

/**
 * Extrait les valeurs par défaut des schémas pour créer la configuration initiale
 * @param schemas - Les schémas du formulaire
 * @returns La configuration initiale basée sur les valeurs par défaut des schémas
 */
const extractDefaultConfig = (schemas: FormSchema[]): IFieldConfig => {
  const config: Record<string, any> = {}
  
  schemas.forEach((schema) => {
    if (schema.field && schema.componentProps?.modelValue !== undefined) {
      // Si le champ a une valeur par défaut dans componentProps
      config[schema.field as string] = schema.componentProps.modelValue
    } else if (schema.field && schema.defaultValue !== undefined) {
      // Si le champ a une valeur par défaut directe
      config[schema.field as string] = schema.defaultValue
    }
  })

  return {
    title: '',
    description: '',
    required: false,
    default: config.default || 'none',
    defaultValue: config.defaultValue || '',
    textarea: config.textarea || false,
    localization: config.localization || false,
    time: config.time || false,
    ...config // Fusion avec les autres valeurs par défaut trouvées
  }
}

/**
 * Crée un nouveau champ avec ses schémas personnalisés
 * @param type - Le type de champ à créer
 * @param order - L'ordre du champ
 * @param isBase - Indique s'il s'agit d'un champ de base (non supprimable d'origine)
 * @returns Le nouveau champ
 */
const createField = (type: string, order: number, isBase = false): IField => {
  const { baseSchemas, schemaGroups } = useFormSchemas()
  const { options } = useFieldOptions()
  
  // Récupère le titre du type de champ pour l'utiliser comme titre par défaut
  const fieldTypeLabel = options[type]?.label || $t('form.builder.label.newField')
  
  // Sélection des schémas en fonction du type
  let schemas: FormSchema[] = []
  switch (type) {
    case 'plainText':
      schemas = [
        ...schemaGroups.basic,
        baseSchemas.defaultValue,
        baseSchemas.defaultValueInput,
        baseSchemas.textarea,
        baseSchemas.localization
      ]
      break
    case 'formattedText':
      schemas = [
        ...schemaGroups.withDefault,
        baseSchemas.localization
      ]
      break
    case 'date':
      schemas = [
        ...schemaGroups.withDefault,
        baseSchemas.time
      ]
      break
    case 'slug':
      schemas = [...schemaGroups.slug]
      break
    default:
      schemas = [...schemaGroups.basic]
  }

  // Création de la configuration initiale basée sur les schémas
  const defaultConfig = extractDefaultConfig(schemas)
  
  // Surcharge du titre avec le label du type de champ
  const config = {
    ...defaultConfig,
    title: fieldTypeLabel
  }
  
  let canBeDeleted = !isBase
  let canBeDuplicate = true

  // Le champ slug ne peut pas être dupliqué
  if (type === 'slug') {
    canBeDuplicate = false
  }

  return {
    order,
    type,
    label: config.title,
    name: `field_${order}`,
    required: false,
    options: [],
    config,
    schemas,
    canBeDeleted,
    canBeDuplicate
  }
}

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

// Composable pour la gestion des champs
const useFields = () => {
  const fields = ref<IField[]>([])
  const currentField = ref<IField | null>(null)

  const handleSelectFieldDropdown = async (key: 'duplicate' | 'delete', field: IField) => {
    switch (key) {
      case 'duplicate':
        if (!field.canBeDuplicate) return
        handleDuplicateField(field)
        break
      case 'delete':
        if (!field.canBeDeleted) return
        handleRemoveField(field)
        break
    }
  }

  /**
   * Met à jour les schémas du champ avec les nouvelles valeurs de configuration
   * @param field - Le champ à mettre à jour
   * @param values - Les nouvelles valeurs
   */
  const updateFieldSchemas = (field: IField, values: Record<string, any>) => {
    // Mise à jour des valeurs du modèle
    field.config = {
      ...field.config,
      ...values
    }

    // Mise à jour des schémas avec les nouvelles valeurs
    field.schemas = field.schemas.map(schema => {
      const value = values[schema.field as string]
      if (value !== undefined) {
        return {
          ...schema,
          componentProps: {
            ...schema.componentProps,
            value // Mettre à jour la valeur dans componentProps
          },
          defaultValue: value // Mettre à jour la valeur par défaut
        }
      }
      return schema
    })

    // Mise à jour du label si le titre a changé
    if (values.title) {
      field.label = values.title
    }

    // Mise à jour des options de slug si nécessaire
    if (field.type === 'plainText') {
      updateSlugOptions()
    }

    // Émettre la mise à jour des champs
    emit('update:fields', fields.value)
  }

  /**
   * Initialise les valeurs par défaut des schémas d'un champ
   * @param field - Le champ à initialiser
   */
  const initFieldSchemaValues = (field: IField) => {
    const defaultValues: Record<string, any> = {}
    
    field.schemas.forEach(schema => {
      if (schema.field) {
        if (schema.componentProps?.value !== undefined) {
          defaultValues[schema.field as string] = schema.componentProps.value
        } else if (schema.defaultValue !== undefined) {
          defaultValues[schema.field as string] = schema.defaultValue
        }
      }
    })

    updateFieldSchemas(field, defaultValues)
  }

  const handleDuplicateField = (field: IField) => {
    const newField = createField(field.type, fields.value.length)
    newField.config = { ...field.config }
    fields.value.push(newField)
    handleSelectField(newField)
  }

  const handleRemoveField = (field: IField) => {
    const index = fields.value.findIndex(f => f.order === field.order)
    fields.value.splice(index, 1)
    if (fields.value.length > 0) {
      handleSelectField(fields.value[0])
    }
  }

  const handleAddField = (type: string) => {
    const newField = createField(type, fields.value.length)
    initFieldSchemaValues(newField)
    fields.value.push(newField)
    handleSelectField(newField)
  }

  const handleSelectField = (field: IField) => {
    currentField.value = field
  }

  const handleUpdateConfig = (field: IField, value: IFieldConfig) => {
    updateFieldSchemas(field, value)
  }

  /**
   * Met à jour les options du champ slug avec les titres actuels des champs plainText
   */
  const updateSlugOptions = () => {
    const plainTextFields = fields.value
      .filter(f => f.type === 'plainText')
      .map(f => ({
        label: f.config.title || f.label,
        value: f.name
      }))

    fields.value.forEach(field => {
      if (field.type === 'slug') {
        field.schemas = field.schemas.map(schema => {
          if (schema.field === 'baseField') {
            return {
              ...schema,
              componentProps: {
                ...schema.componentProps,
                options: plainTextFields
              }
            }
          }
          return schema
        })
      }
    })
  }

  // Initialisation des champs par défaut
  const initializeDefaultFields = () => {
    const defaultFields = [
      createField('plainText', 0, true),
      createField('slug', 1, true)
    ]
    
    defaultFields.forEach(field => {
      initFieldSchemaValues(field)
    })
    
    fields.value = defaultFields
    updateSlugOptions()
    
    if (defaultFields.length > 0) {
      handleSelectField(defaultFields[0])
    }
  }

  // Initialisation
  onMounted(() => {
    initializeDefaultFields()
  })

  // Observateur pour émettre les changements de champs
  watch(
    () => fields.value,
    (newFields) => {
      emit('update:fields', newFields)
    },
    { deep: true }
  )

  return {
    fields,
    currentField,
    handleAddField,
    handleSelectField,
    handleUpdateConfig,
    handleSelectFieldDropdown,
    initializeDefaultFields,
  }
}

// Composable pour la gestion du modal
const useModal = () => {
  const showModal = ref(false)
  const modalTitle = ref('')
  const titleInputRef = ref()
  const { handleSelectField, fields, initializeDefaultFields } = useFields()

  /**
   * Affiche le modal et initialise les données si nécessaire
   * @param data - Données optionnelles pour la modification
   */
  const handleShowModal = (data?: IBasicCollectionType) => {
    showModal.value = true

    if (data) {
      // Mode modification
      mode.value = 'update'
      formData.value = { ...data }
      modalTitle.value = data.name || $t('common.title')
      
      // Restaurer les champs existants
      fields.value = data.fields
      if (fields.value.length > 0) {
        handleSelectField(fields.value[0])
      }
    } else {
      // Mode création
      mode.value = 'create'
      formData.value = {
        id: 0,
        name: '',
        description: '',
        fields: [],
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
      modalTitle.value = $t('form.builder.newBlock')
      initializeDefaultFields()
    }

    // Déclencher l'édition du titre après l'affichage du modal
    nextTick(() => {
      titleInputRef.value?.handleStartEdit()
    })
  }

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = () => {
    formData.value.fields = fields.value
    formData.value.name = modalTitle.value // Utilisation directe de la valeur sans formatage

    if(mode.value == 'create') {
      emit('submit', formData.value)
    } else {
      emit('update:data', formData.value)
    }
    showModal.value = false
  }

  /**
   * Gère l'annulation
   */
  const handleCancel = () => {
    emit('cancel')
    showModal.value = false
  }

  return {
    showModal,
    modalTitle,
    titleInputRef,
    handleShowModal,
    handleSubmit,
    handleCancel
  }
}

// Composable pour les schémas de formulaire
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

// Composable pour les options de champs
const useFieldOptions = () => {
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

  // Filtre les options pour le popselect (exclut celles avec show: false)
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

// Composition des composables
const { showModal, modalTitle, titleInputRef, handleShowModal, handleSubmit, handleCancel } = useModal()
const { fields, currentField, handleSelectFieldDropdown, handleAddField, handleSelectField, handleUpdateConfig } = useFields()
const { options, popselectOptions, renderLabel } = useFieldOptions()

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
        <VueDraggable v-if="fields.length" v-model="fields" :animation="150" filter=".none_draggable">
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
