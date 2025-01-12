import { NIcon } from "naive-ui"

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
