/**
 * Merges multiple class names into a single string, ensuring no duplicates.
 *
 * This utility function takes any number of class name strings and combines them into a
 * single string, ensuring that each class name appears only once in the result.
 *
 * ## Usage
 *
 * ```ts
 * import { classMerge } from '@/utils/classMerge';
 *
 * const class1 = 'text-lg bg-blue-500';
 * const class2 = 'text-lg p-4';
 *
 * const mergedClasses = classMerge(class1, class2);
 * console.log(mergedClasses); // Output: 'text-lg bg-blue-500 p-4'
 * ```
 *
 * @param {...(string | undefined | null | false)[]} classes - The class names to merge.
 * @returns {string} The merged class names as a single string.
 */
export function classMerge(...classes: (string | undefined | null | false)[]): string {
  const classSet = new Set<string>();
  classes.forEach(cls => {
    if (typeof cls === 'string') {
      cls.split(' ').forEach(c => classSet.add(c));
    }
  });
  return Array.from(classSet).join(' ');
}
