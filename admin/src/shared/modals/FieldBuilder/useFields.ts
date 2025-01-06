import type { IField, IFieldConfig, IFieldOption } from '#/model'
import type { FormSchema } from '@/components/FormBuilder'
import { $t } from '@/locales'
import { onMounted, ref, watch } from 'vue'
import { useFieldOptions } from './useFieldOptions'
import { useFormSchemas } from './useFormSchema'

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

  console.log({ option: options[type] })

  return {
    order,
    // type,
    // label: config.title,
    // options: [],
    ...options[type],
    config,
    type,
    canBeDeleted,
    canBeDuplicate,
    required: false,
    field: `field_${order}`,
  }
}

const fields = ref<IField[]>([])
export const useFields = (emit: any) => {
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
        value: f.field
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
