<script setup lang="ts">
import type { IBasicCollectionType, IField } from '#/model';
import EditableText from '@/components/EditableText.vue';
import type { FormSchema } from '@/components/FormBuilder';
import { useNaiveHelper } from '@/composables/web/useNaiveHelper';
import { $t } from '@/locales';
import { DropdownDividerOption, DropdownGroupOption, DropdownOption, DropdownRenderOption, NButton, NIcon, NText } from 'naive-ui';
import { VueDraggable } from 'vue-draggable-plus';
import { useModal } from './useModal'
import { useFields } from './useFields'
import { useFieldOptions } from './useFieldOptions'

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

// Composition des composables
const { showModal, modalTitle, titleInputRef, handleShowModal, handleSubmit, handleCancel } = useModal(emit)
const { fields, currentField, handleSelectFieldDropdown, handleAddField, handleSelectField, handleUpdateConfig } = useFields(emit)
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
