<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/locales'

defineOptions({
  name: 'AppLocalPicker',
})

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
})

const emit = defineEmits<Emits>()

interface Props {
  /** Current language */
  lang: I18n.LangType
  /** Language options */
  langOptions: I18n.LangOption[]
  /** Show tooltip */
  showTooltip?: boolean
}

interface Emits {
  (e: 'changeLang', lang: I18n.LangType): void
}

const tooltipContent = computed(() => {
  if (!props.showTooltip)
    return ''

  return t('icon.lang')
})

function changeLang(lang: I18n.LangType) {
  emit('changeLang', lang)
}
</script>

<template>
  <NDropdown :value="lang" :options="langOptions" trigger="hover" @select="changeLang">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="ph:translate-bold" />
      </ButtonIcon>
    </div>
  </NDropdown>
</template>

<style scoped></style>
