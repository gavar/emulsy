/**
 * Check two objects has property with different value.
 * @param a - first object to compare.
 * @param b - second object to compare.
 * @param set - object containing set of keys to check equality true.
 * @param inverse - whether to check only those keys that are not in {@param set}.
 * @param is - equality comparison function.
 */
export function shallowDiffersKeySet<A = any, B = any>(
  a: A, b: B,
  set: Record<string, any>,
  inverse: boolean = false,
  is = Object.is): boolean {
  if (!is(a, b)) {
    if (a == null) return b != null;
    if (b == null) return true;

    for (const k in a)
      if (k in set !== inverse)
        if (!(k in b))
          return true;

    for (const k in b)
      if (k in set !== inverse)
        if (!is((a as any)[k], (b as any)[k]))
          return true;
  }
  return false;
}
