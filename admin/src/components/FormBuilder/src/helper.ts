import type { FormItemRule } from 'naive-ui'
import { $t } from '@/locales'
import type { ComponentType } from './types/index.js'

/**
 * @description: Générer un espace réservé
 */
export function createPlaceholderMessage(component?: ComponentType) {
  if (!component) return ''

  if (
    ['NPicker', 'NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(
      component
    )
  )
    return $t('form.placeholder.select')

  return $t('form.placeholder.input')
}

const DATE_TYPE = ['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker']

function genType() {
  return [...DATE_TYPE, 'RangePicker']
}

export function setComponentRuleType(
  rule: FormItemRule,
  component: ComponentType,
  valueFormat = true
) {
  switch (component) {
    case 'NDatePicker':
    case 'NTimePicker':
      rule.type = valueFormat ? 'string' : 'object'
      break
    case 'NUpload':
    case 'NCheckboxGroup':
    case 'NDateRangePicker':
      rule.type = 'array'
      break
    case 'NInputNumber':
      rule.type = 'number'
      break
  }
}

/**
 * champ de temps
 */
export const dateItemType = genType()

export function defaultType(component: ComponentType) {
  if (component === 'NInput') return ''
  if (component === 'NInputNumber') return null
  return ['NSelect', 'NCheckbox', 'NRadio', 'NSwitch', 'NDatePicker', 'NTimePicker'].includes(
    component
  )
    ? ''
    : undefined
}
