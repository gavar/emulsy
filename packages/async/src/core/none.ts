import { pull } from "lodash";

/** Null object for internal use. */
export const none: any = Object.freeze({});

/**
 * Check if the value is {@link Null}.
 * @param v - value to check.
 */
export function isNone<T>(v: T): boolean {
  return v === none;
}

/**
 * Check if the value is not {@link Null}.
 * @param v - value to check.
 */
export function isNotNone<T>(v: T): boolean {
  return v !== none;
}

/**
 * Returns {@link none} value when input condition is faulty.
 * @param test - test condition to evaluate.
 * @param value - value to return when condition is truthy.
 */
export function elseNone<T>(test: boolean, value: T): T {
  return test ? value : none;
}

/**
 * Removes {@link none} values from array, by mutating array.
 * @param values - array to modify.
 * @return input array.
 */
export function pullNone<U, T extends ArrayLike<U>>(values: T): T {
  return pull(values, none) as T;
}
