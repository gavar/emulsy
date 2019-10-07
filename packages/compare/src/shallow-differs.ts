/**
 * Shallow compare whether two object has any property with different value.
 * @see https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
 */
export function shallowDiffers(a: any, b: any): boolean {
  if (a !== b) {
    // differs if one is null or undefined and other is not
    if (a == null) return b != null;
    if (b == null) return true;
    // compare every property
    for (const k in a) if (!(k in b)) return true;
    for (const k in b) if (a[k] !== b[k]) return true;
  }
  return false;
}
