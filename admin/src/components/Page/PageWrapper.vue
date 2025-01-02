<script setup lang="ts">
import { useDesign } from '@/composables/web/useDesign'
import { useThemeStore } from '@/stores/modules/theme'
import { getNaiveCssVars } from '@/stores/modules/theme/shared'
import { omit } from 'lodash-es'
import type { CSSProperties, StyleValue } from 'vue'
import PageFooter from './PageFooter.vue'

interface Props {
  title?: string
  isTitleBack?: boolean
  isTitleBottomBack?: boolean
  ghost?: boolean
  content?: string
  contentStyle?: CSSProperties
  contentBackground?: boolean
  contentClass?: string
}

const props = defineProps<Props>()

const slots = useSlots()
const router = useRouter()
const { prefixCls } = useDesign('page-wrapper')
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const { headerColor: c, headerBorderColor: bc } = getNaiveCssVars('Layout')
const { headerColor: dark_c, headerBorderColor: dark_bc } = getNaiveCssVars('Layout', true)

const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter)

const getHeaderSlots = computed(() => {
  return Object.keys(omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'))
})

const getHeaderStyle = computed((): StyleValue => {
  return {
    padding: '16px 24px',
    transition:
        'background-color var(--app-transition-duration) var(--app-bezier), border-color var(--app-transition-duration) var(--app-bezier)',
    borderBottom: `1px solid ${darkMode.value ? dark_bc : bc}`,
    ...(props.ghost ? {} : { backgroundColor: darkMode.value ? dark_c : c }),
  }
})

const getContentStyle = computed((): CSSProperties => ({ ...props.contentStyle }))

const getContentClass = computed(() => {
  const { contentBackground, contentClass } = props
  return [
      `${prefixCls}-content`,
      contentClass,
      {
        [`${prefixCls}-content-bg`]: contentBackground,
      },
  ]
})
</script>

<template>
  <div :class="[prefixCls, $attrs.class ?? {}]">
    <NPageHeader
      v-if="content || $slots.headerContent || title || getHeaderSlots.length"
      v-bind="omit($attrs, 'class')"
      :style="getHeaderStyle"
    >
      <template v-if="content || $slots.headerContent" #default>
        <div v-if="content" class="text-$app-text-color">
          {{ content }}
        </div>
        <slot v-else name="headerContent" />
      </template>
      <template #title>
        <template v-if="title">
          <n-button v-if="isTitleBack" text @click="router.go(-1)">
            <template #icon>
              <n-icon :size="19" class="mr-6">
                <i-ic:sharp-arrow-back-ios />
              </n-icon>
            </template>
          </n-button>
          <span class="text-xl font-bold">{{ title }}</span>
        </template>
        <slot v-else name="title" />
      </template>

      <template v-for="item in getHeaderSlots" #[item]="data">
        <slot :name="item" v-bind="data || {}" />
      </template>
    </NPageHeader>

    <div class="overflow-hidden" :class="getContentClass" :style="getContentStyle">
      <slot />
    </div>

    <PageFooter v-if="getShowFooter" :is-title-bottom-back="isTitleBottomBack">
      <template #left>
        <slot name="leftFooter" />
      </template>
      <template #right>
        <slot name="rightFooter" />
      </template>
    </PageFooter>
  </div>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-page-wrapper';

.@{prefix-cls} {
  position: relative;

  .@{prefix-cls}-content {
    margin: 24px;
  }
}
</style>
