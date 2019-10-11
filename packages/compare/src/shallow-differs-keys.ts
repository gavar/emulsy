/**
 * Shallow compare whether two object has any property with different value.
 * @param a - first object to compare.
 * @param b - second object to compare.
 * @param keys - list of keys to check for equality.
 * @param is - equality comparison function.
 * @see https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
 */
export function shallowDiffersKeys<A = any, B = any>(
  a: A, b: B,
  keys: Array<keyof A | keyof B | string>,
  is = Object.is): boolean {
  if (!is(a, b)) {
    if (a == null) return b != null;
    if (b == null) return true;
    for (const k of keys as Array<keyof A & keyof B>)
      if (!is(a[k], b[k]))
        return true;
  }
  return false;
}
