import { isArrayLike, isObjectLike } from "lodash";
import { ArrayIterator } from "./array-iterator";
import { EmptyIterator } from "./empty-iterator";
import { IterateIterator } from "./iterate-iterator";
import { PropertyIterator } from "./property-iterator";
import { Enumerator } from "./types";

/**
 * Defines types of objects that are eligible for iterating.
 * Use this when you don't need to know type of the key associated with the value.
 */
export type Iterative<T = any> = ReadonlyArray<T> | Iterable<T> | Record<keyof any, T>;

/**
 * Defines types of objects that are eligible for iterating.
 * Provides types checks for type of the key associated with the value.
 */
export type IterativeKey<K extends keyof any, T = any> = ReadonlyArray<T> | Iterable<T> | Record<K, T>;

/** Get instance of empty iterator. */
export function iterator(): Enumerator<never, never>;

/** Get instance of empty iterator. */
export function iterator(empty: undefined | null): Enumerator<never, never>;

/**
 * Create iterator for the array.
 * @param array - array with values to iterate.
 */
export function iterator<T>(array: ReadonlyArray<T>): Enumerator<T, number>;

/**
 * Create iterator for the native iterable.
 * @param iterable - iterable object to iterate.
 */
export function iterator<T>(iterable: Iterable<T>): Enumerator<T, never>;

/**
 * Create iterator for the object values.
 * @param iterable - object with values to iterate.
 */
export function iterator<T>(iterable: Record<keyof any, T>): Enumerator<T>;

/**
 * Create iterator for the object properties.
 * @param object - object with properties to iterate.
 */
export function iterator<K extends keyof any, T>(object: Record<K, T>): Enumerator<T, K>;

export function iterator<T>(object: Iterative<T>): Enumerator<T>;
export function iterator<K extends keyof any, T>(object: IterativeKey<K, T>): Enumerator<T, K>;
export function iterator(iterative?: any) {
  if (iterative) {
    if (Array.isArray(iterative)) return new ArrayIterator(iterative) as any;
    if (isIterable(iterative)) return new IterateIterator(iterative[Symbol.iterator]());
    if (isArrayLike(iterative)) return new ArrayIterator(iterative) as any;
    if (isObjectLike(iterative)) return new PropertyIterator(iterative);
  }
  return EmptyIterator.instance;
}

function isIterable<T>(object: any): object is Iterable<T> {
  return typeof object[Symbol.iterator] === "function";
}
