import { KeySet } from "./key-set";

/**
 * From A pick those properties that are not in B.
 * Think of relative complement in terms of set theory.
 * @param a - object whose properties to pick.
 * @param b - object containing set of keys to omit from picking.
 * @return new object filled with properties.
 */

export function omitKeySet<T, K extends keyof T>(a: T, b: KeySet<K>): Omit<T, K>;

/**
 * From A pick those properties that are not in B.
 * Think of relative complement in terms of set theory.
 * @param a - object whose properties to pick.
 * @param b - object containing set of keys to omit from picking.
 * @param out - target object to fill with properties.
 * @return target object filled with properties.
 */
export function omitKeySet<T, K extends keyof T, O = {}>(a: T, b: KeySet<K>, out: O): O & Omit<T, K>;

/** @internal */
export function omitKeySet(a: any, b: any, out: any = {}) {
  for (const key in a)
    if (!(key in b))
      out[key] = a[key];
  return out;
}
