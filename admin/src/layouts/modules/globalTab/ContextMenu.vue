<script setup lang="ts">
import { useSvgIcon } from '@/composables/web/useSvgIcon'
import { t } from '@/locales'
import { useTabStore } from '@/stores/modules/tab'
import type { VNode } from 'vue'
import { computed } from 'vue'

defineOptions({
  name: 'ContextMenu',
})

const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => [],
})

interface Props {
  /** ClientX */
  x: number
  /** ClientY */
  y: number
  tabId: string
  excludeKeys?: App.Global.DropdownKey[]
  disabledKeys?: App.Global.DropdownKey[]
}

const visible = defineModel<boolean>('visible')

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs } = useTabStore()
const { SvgIconVNode } = useSvgIcon()

interface DropdownOption {
  key: App.Global.DropdownKey
  label: string
  icon?: () => VNode
  disabled?: boolean
}

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: t('dropdown.closeCurrent'),
      icon: SvgIconVNode({ icon: 'ph:x-bold', fontSize: 18 }),
    },
    {
      key: 'closeOther',
      label: t('dropdown.closeOther'),
      icon: SvgIconVNode({ icon: 'ph:arrows-out-line-horizontal-bold', fontSize: 18 }),
    },
    {
      key: 'closeLeft',
      label: t('dropdown.closeLeft'),
      icon: SvgIconVNode({ icon: 'ph:arrow-line-left-bold', fontSize: 18 }),
    },
    {
      key: 'closeRight',
      label: t('dropdown.closeRight'),
      icon: SvgIconVNode({ icon: 'ph:arrow-line-right-bold', fontSize: 18 }),
    },
    {
      key: 'closeAll',
      label: t('dropdown.closeAll'),
      icon: SvgIconVNode({ icon: 'ph:minus-bold', fontSize: 18 }),
    },
  ]
  const { excludeKeys, disabledKeys } = props

  const result = opts.filter(opt => !excludeKeys.includes(opt.key))

  disabledKeys.forEach((key) => {
    const opt = result.find(item => item.key === key)

    if (opt) {
      opt.disabled = true
    }
  })

  return result
})

function hideDropdown() {
  visible.value = false
}

const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId)
  },
  closeOther() {
    clearTabs([props.tabId])
  },
  closeLeft() {
    clearLeftTabs(props.tabId)
  },
  closeRight() {
    clearRightTabs(props.tabId)
  },
  closeAll() {
    clearTabs()
  },
}

function handleDropdown(optionKey: App.Global.DropdownKey) {
  dropdownAction[optionKey]?.()
  hideDropdown()
}
</script>

<template>
  <NDropdown
    :show="visible"
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    @clickoutside="hideDropdown"
    @select="handleDropdown"
  />
</template>

<style scoped></style>
