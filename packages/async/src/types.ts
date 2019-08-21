import { Iterative, IterativeKey } from "@emulsy/util";

/** Value that may be result of an async operation. */
export type Async<T = unknown> = T | Promise<T>;

export type AsyncIterative<T = any> = Iterative<Async<T>>;
export type AsyncIterativeKey<K extends keyof any, T = any> = IterativeKey<K, Async<T>>;

/**
 * Asynchronous action that receives arguments but returns no result.
 * @template P - arguments types.
 */
export type AsyncAction<P extends any[] = []> = (...params: P) => Async;

/**
 * Asynchronous function that receives arguments and returns a value.
 * @template R - return value type.
 * @template P - arguments types.
 */
export type AsyncFunction<R = any, P extends any[] = []> = (...params: P) => Async<R>;

/**
 * Asynchronous function that defines a set of criteria and determines
 * whether the specified object meets those criteria.
 * @template T - type of the object to check.
 * @template T - type of arguments to pass into predicate.
 */
export type AsyncPredicate<T = any, P extends any[] = []> = (value: T, ...args: P) => Async<boolean>;
