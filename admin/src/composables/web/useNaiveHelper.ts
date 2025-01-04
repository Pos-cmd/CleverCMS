import { NIcon } from "naive-ui"

export function useNaiveHelper () {
  const renderIcon = (icon: string)  => {
    return h(NIcon, {}, {
      default: () => h('i', { class: icon })
    })
  }

  return {
    renderIcon
  }
}
