<script setup lang="ts">
import { useDesign } from '@/composables/web/useDesign'
import { $t } from '@/locales'
import { useThemeStore } from '@/stores/modules/theme'
import { getNaiveCssVars } from '@/stores/modules/theme/shared'
import { colord } from '@clever/color'

interface Props {
  isTitleBottomBack?: boolean
}

defineProps<Props>()

const { prefixCls } = useDesign('page-footer')
const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)
const router = useRouter()

const { headerColor: fc, footerBorderColor: fbc } = getNaiveCssVars('Layout')
const { footerColor: dark_fc, footerBorderColor: dark_fbc } = getNaiveCssVars('Layout', true)

const getColors = computed(() => {
  const isDark = darkMode.value
  return {
    color: isDark ? dark_fc : fc,
    backdropColor: colord(isDark ? dark_fc : fc)
      .alpha(0.25)
      .toRgbString(),
    borderColor: isDark ? dark_fbc : fbc,
  }
})

useCssVars(() => {
  const prefix = 'page-footer'
  const { color, backdropColor, borderColor } = getColors.value
  return {
    [`${prefix}-color`]: color,
    [`${prefix}-backdrop-color`]: backdropColor,
    [`${prefix}-border-color`]: borderColor,
  }
})
</script>

<template>
  <div class="sticky bottom-0 z-1000 overflow-hidden transition-all">
    <transition name="page-footer-fade" appear>
      <div :class="[prefixCls]">
        <div :class="`${prefixCls}__left`">
          <div v-if="isTitleBottomBack" class="flex-ac py-2">
            <n-button strong quaternary @click="router.go(-1)">
              <template #icon>
                <n-icon :size="14" class="mb-2px">
                  <i-ph-caret-left-bold />
                </n-icon>
              </template>
              {{ $t('button.back') }}
            </n-button>
          </div>
          <slot name="left" />
        </div>
        <slot />
        <div :class="`${prefixCls}__right`">
          <slot name="right" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-page-footer';
@blur: blur(3px);

.@{prefix-cls} {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 24px;
  line-height: 44px;
  border-top: 1px solid var(--page-footer-border-color);
  transition:
    background-color var(--app-transition-duration) var(--app-bezier),
    border-color var(--app-transition-duration) var(--app-bezier);

  &__left {
    flex: 1 1;
  }
}

@supports (backdrop-filter: @blur) or (-webkit-backdrop-filter: @blur) {
  .@{prefix-cls} {
    background-color: var(--page-footer-backdrop-color);
    -webkit-backdrop-filter: @blur;
    backdrop-filter: @blur;
  }
}

@supports not (backdrop-filter: @blur) {
  .@{prefix-cls} {
    background-color: var(--page-footer-color);
  }
}

.page-footer-fade-enter-from,
.page-footer-fade-leave-to {
  opacity: 0;
  transform: translateY(65%);
}

.page-footer-fade-enter-active {
  transition: all 0.38s cubic-bezier(0.17, 0.44, 0.23, 0.99);
}
</style>
