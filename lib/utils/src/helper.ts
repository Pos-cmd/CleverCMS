/**
 * @description Deep clone an object or array
 * @param {T} value - The value to deep clone
 * @returns {T} - The deep cloned value
 */
export function cloneDeep<T>(value: T): T {
  // Check for non-object types (primitive values)
  if (value === null || typeof value !== 'object') {
    return value
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as unknown as T
  }

  // Handle objects
  const result: any = {}
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = cloneDeep((value as any)[key])
    }
  }

  return result as T
}
