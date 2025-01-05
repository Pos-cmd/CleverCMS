import { ref, nextTick } from 'vue'
import type { IBasicCollectionType } from '#/model'
import { $t } from '@/locales'
import { useFields } from './useFields'

export const useModal = (emit: any) => {
  const showModal = ref(false)
  const modalTitle = ref('')
  const titleInputRef = ref()
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

  const { handleSelectField, fields, initializeDefaultFields } = useFields(emit)

  /**
   * Affiche le modal et initialise les données si nécessaire
   * @param data - Données optionnelles pour la modification
   */
  const handleShowModal = (data?: IBasicCollectionType) => {
    showModal.value = true

    if (data) {
      mode.value = 'update'
      formData.value = { ...data }
      modalTitle.value = data.name || $t('common.title')
      
      fields.value = data.fields
      if (fields.value.length > 0) {
        handleSelectField(fields.value[0])
      }
    } else {
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

    nextTick(() => {
      titleInputRef.value?.handleStartEdit()
    })
  }

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = () => {
    formData.value.fields = fields.value
    formData.value.name = modalTitle.value

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
    mode,
    formData,
    handleShowModal,
    handleSubmit,
    handleCancel
  }
}
