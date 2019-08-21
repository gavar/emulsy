import { iterator } from "@emulsy/util";
import { noop } from "lodash";
import { accumulateWhen } from "./core";
import { isAsync, then } from "./then";
import { Async, AsyncAction, AsyncIterative } from "./types";

/**
 * Apply the {@param action} for every element in parallel.
 * Performs in parallel, so there is no guarantee actions will complete in order.
 * @param iterable - an object to iterate.
 * @param action - action to apply for every item.
 */
export function each<T>(iterable: AsyncIterative<T>, action: AsyncAction<[T]>): Async<void> {
  let promises: Async[];
  for (const it = iterator(iterable); it.hasNext;) {
    const item = then(it.next(), action);
    promises = accumulateWhen(item, isAsync, promises);
  }

  if (promises)
    return Promise.all(promises).then(noop);
}
