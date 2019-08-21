import { identity, identity2, iterator } from "@emulsy/util";
import { Find, FindSelector } from "./internal";
import { isAsync, then } from "./then";
import { Async, AsyncIterative, AsyncIterativeKey } from "./types";

/**
 * Gets the first item that match the predicate.
 * Performs in parallel, so wins who's faster, rather then while closer to the beginning.
 * May complete synchronously when any value matches predicate synchronously.
 * @param iterable - a collection to iterate over.
 * @param predicate - predicate defining criteria to match.
 * @param defaultValue - value to return when none of the items match the predicate.
 */
export function find<T>(
  iterable: AsyncIterative<T>,
  predicate: (value: T) => Async<boolean>,
  defaultValue?: Async<T>,
): Async<T> {
  return execute(iterable, predicate, defaultValue, identity);
}

/**
 * Gets the first key of the item that match the predicate.
 * Performs in parallel, so wins who's faster, rather then while closer to the beginning.
 * May complete synchronously when any value matches predicate synchronously.
 * @param iterable - a collection to iterate over.
 * @param predicate - predicate defining criteria to match.
 * @param defaultKey = null - key to return when none of the items match the predicate.
 */
export function findKey<T>(
  iterable: ArrayLike<T>,
  predicate: (value: T) => Async<boolean>,
  defaultKey?: Async<number>,
): Async<null | number>;

/**
 * Gets the first key of the item that match the predicate.
 * Performs in parallel, so wins who's faster, rather then while closer to the beginning.
 * May complete synchronously when any value matches predicate synchronously.
 * @param iterable - a collection to iterate over.
 * @param predicate - predicate defining criteria to match.
 * @param defaultKey = null - key to return when none of the items match the predicate.
 */
export function findKey<T, K extends keyof any>(
  iterable: AsyncIterativeKey<K, T>,
  predicate: (value: T) => Async<boolean>,
  defaultKey: Async<K> = null,
): Async<null | K> {
  return execute(iterable, predicate, defaultKey, identity2);
}

/** @internal */
function execute<K extends keyof any, T, R>(
  iterable: AsyncIterativeKey<K, T>,
  predicate: (value: T) => Async<boolean>,
  defaultValue: Async<R>,
  selector: FindSelector<K, T, R>,
): Async<R> {
  let ctx: Find<K, T, R>;
  for (const it = iterator(iterable); it.hasNext;) {
    const value = it.next();
    const match = then(value, predicate);
    if (isAsync(match)) {
      ctx = ctx || new Find(defaultValue, selector);
      ctx.listen(match, it.key, value);
    } else if (match) {
      if (ctx) ctx.done = true;
      return selector(value, it.key);
    }
  }
  return ctx.wait();
}



