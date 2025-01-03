export enum SizeEnum {
  XXS = '2xs',
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
}

export enum ScreenEnum {
  XXS = 376,
  XS = 480,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

const screenMap = new Map<SizeEnum, number>()

screenMap.set(SizeEnum.XXS, ScreenEnum.XXS)
screenMap.set(SizeEnum.XS, ScreenEnum.XS)
screenMap.set(SizeEnum.SM, ScreenEnum.SM)
screenMap.set(SizeEnum.MD, ScreenEnum.MD)
screenMap.set(SizeEnum.LG, ScreenEnum.LG)
screenMap.set(SizeEnum.XL, ScreenEnum.XL)
screenMap.set(SizeEnum.XXL, ScreenEnum.XXL)

function genBreakpoint<T>(suffix?: T): Record<string, T extends string ? string : number> {
  return Object.fromEntries(
    [...screenMap.entries()].map(([key, val]) => {
      if (suffix && typeof suffix === 'string') return [key, `${val}${suffix}`]
      else return [key, val]
    })
  )
}

const getBreakpoint = genBreakpoint()
const getWindiBreakpoint = genBreakpoint('px')

export { getBreakpoint, getWindiBreakpoint, screenMap }
