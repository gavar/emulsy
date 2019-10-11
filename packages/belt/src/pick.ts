import { identity } from "./identity";

/** Predicate defining filtering criteria of properties to pick. */
export interface PickPredicate<T = any, P extends any[] = any[]> {
  <K extends keyof T>(value: T[K], key: K, ...params: P): any,
}

/**
 * Populate target object with those properties of source object that match given predicate.
 * @param target - target object to write properties into.
 * @param source - source object containing props to pick.
 * @param predicate - {@link PickPredicate predicate} defines criteria to meet in order to pick property.
 * @param params - extra parameters to pass into predicate along with value and key.
 */
export function pickToBy<T, S, P extends any[]>(
  target: T, source: S,
  predicate: PickPredicate<S, P> = identity as any,
  ...params: P): T {
  if (source) {
    target = target || {} as any;
    for (const key of Object.keys(source) as Array<keyof S>)
      if (predicate(source[key], key, ...params))
        (target as any)[key] = source[key];
  }
  return target;
}
