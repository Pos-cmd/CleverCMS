import { MenuOption, NIcon } from "naive-ui"
import SvgIcon from '@/components/SvgIcon/index.vue'

export function useNaiveHelper () {
  const renderIcon = (icon: string)  => {
    return h(NIcon, null, {
      default: () => h('i', { class: icon })
    })
  }

  return {
    renderIcon,
  }
}
