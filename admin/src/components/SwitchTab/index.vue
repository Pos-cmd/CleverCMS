<script setup lang="ts">
/**
 * Interface définissant la structure d'un onglet
 */
interface Tab {
  value: string
  label: string
  content?: string
}

/**
 * Props du composant
 */
interface Props {
  /** Liste des onglets à afficher */
  tabs: Tab[]
  /** Valeur actuellement sélectionnée */
  modelValue: string,
  /** Taille des onglets */
  size?: 'small' | 'medium' | 'large'
}

/**
 * Définition des props avec leurs valeurs par défaut
 */
withDefaults(defineProps<Props>(), {
  tabs: () => [],
  modelValue: '',
  size: 'medium'
})

/**
 * Émetteur d'événements pour la mise à jour de la valeur
 */
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/**
 * Gère le changement de sélection
 * @param value - La nouvelle valeur sélectionnée
 */
const handleChange = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <n-tabs
    type="segment"
    :size="size"
    animated
    :value="modelValue"
    @update:value="handleChange"
  >
    <n-tab-pane
      v-for="tab in tabs"
      :key="tab.value"
      :name="tab.value"
      :tab="tab.label"
    >
      {{ tab.content }}
    </n-tab-pane>
  </n-tabs>
</template>

<style scoped>
:deep(.n-tabs.n-tabs--top .n-tab-pane) {
  padding: 0 !important;
}
</style>
