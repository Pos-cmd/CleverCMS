const { toString } = Object.prototype

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isSymbol(val: any): val is symbol {
  return is(val, 'Symbol')
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) return val.length === 0

  if (val instanceof Map || val instanceof Set) return val.size === 0

  if (isObject(val)) return Object.keys(val).length === 0

  return false
}

export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

/**
 * @description Check if a string is a valid URL
 * @param {string} value - The string to check
 * @returns {boolean} - True if the string is a valid URL, false otherwise
 */
export function isUrl(value: string): boolean {
  const urlPattern = new RegExp(
    '^' +
      // protocol identifier
      '(?:https?|ftp)://' +
      // user:pass authentication
      '(?:\\S+@)?' +
      '(?:' +
      // IP address exclusion
      // private & local networks
      '(?!10(?:\\.\\d{1,3}){3})' +
      '(?!127(?:\\.\\d{1,3}){3})' +
      '(?!169\\.254(?:\\.\\d{1,3}){2})' +
      '(?!192\\.168(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[01])(?:\\.\\d{1,3}){2})' +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '\\.(?:\\d\\d?|1\\d\\d|2[0-4]\\d|25[0-4])' +
      '|' +
      // host name
      // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
      '(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+' +
      // domain name
      '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9])*' +
      // TLD identifier
      '\\.[a-z\\u00a1-\\uffff]{2,}' +
      ')' +
      // port number
      '(?::\\d{2,5})?' +
      // resource path
      '(?:/\\S*)?' +
      '$',
    'i'
  )

  return urlPattern.test(value)
}
