import { useBreakpoints } from '@vueuse/core'
import { getBreakpoint, SizeEnum } from '@/enums/breakpoint'

let breakpoints: ReturnType<typeof useBreakpoints>
export function useBreakpoint() {
  if (!breakpoints) breakpoints = useBreakpoints(getBreakpoint)

  return { ...breakpoints, SizeEnum }
}
