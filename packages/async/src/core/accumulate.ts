import { Predicate } from "tstt";

/**
 * Add value to accumulator when it satisfy criteria defined by the provided predicate.
 * @param value - value to check if satisfies criteria.
 * @param predicate - predicate defining criteria to match.
 * @param accumulator - array of accumulated values.
 * @return accumulator array as is or newly created array.
 */
export function accumulateWhen<T>(value: T, predicate: Predicate<T>, accumulator?: T[]): T[] {
  if (predicate(value))
    if (accumulator) accumulator.push(value);
    else accumulator = [value];

  return accumulator;
}
