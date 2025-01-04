<script setup lang="ts">
import { NInput } from 'naive-ui'

interface Props {
  /** Valeur du texte à afficher/éditer */
  modelValue: string
  /** Classe CSS à appliquer au conteneur */
  containerClass?: string
  /** Classe CSS à appliquer au texte */
  textClass?: string
  /** Classe CSS à appliquer à l'input */
  inputClass?: string
  /** Taille de l'input */
  size?: 'tiny' | 'small' | 'medium' | 'large'
  /** Afficher une icône d'édition */
  showEditIcon?: boolean
  /** Classe de l'icône d'édition */
  editIconClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  containerClass: '',
  textClass: '',
  inputClass: '',
  size: 'small',
  showEditIcon: true,
  editIconClass: 'i-tabler-edit'
})

const emit = defineEmits<{
  /** Émis lorsque la valeur change */
  (e: 'update:modelValue', value: string): void
  /** Émis lorsque l'édition commence */
  (e: 'edit:start'): void
  /** Émis lorsque l'édition se termine */
  (e: 'edit:end'): void
}>()

const isEditing = ref(false)
const inputValue = ref(props.modelValue)

/**
 * Active le mode édition
 */
const handleStartEdit = () => {
  isEditing.value = true
  emit('edit:start')
  nextTick(() => {
    const input = document.querySelector('.editable-input') as HTMLInputElement
    if (input) input.focus()
  })
}

/**
 * Désactive le mode édition et sauvegarde les changements
 */
const handleEndEdit = () => {
  isEditing.value = false
  emit('update:modelValue', inputValue.value)
  emit('edit:end')
}

/**
 * Gère les touches spéciales pendant l'édition
 * @param event - L'événement clavier
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    handleEndEdit()
  } else if (event.key === 'Escape') {
    isEditing.value = false
    inputValue.value = props.modelValue
  }
}

// Met à jour la valeur locale quand la prop change
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})
</script>

<template>
  <div :class="containerClass">
    <template v-if="isEditing">
      <n-input
        v-model:value="inputValue"
        :size="size"
        :class="['editable-input', inputClass]"
        @blur="handleEndEdit"
        @keydown="handleKeydown"
      />
    </template>
    <template v-else>
      <span class="flex-y-center gap-2">
        <span
          :class="['cursor-text', textClass]"
          @click="handleStartEdit"
        >
          {{ modelValue }}
        </span>
        <i
          v-if="showEditIcon"
          :class="['cursor-pointer', editIconClass]"
          @click="handleStartEdit"
        />
      </span>
    </template>
  </div>
</template>
