import SvgIcon from '@/components/SvgIcon/index.vue';
import { useSvgIconRender } from '@clever/hooks';

export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon);

  return {
    SvgIconVNode
  };
}
