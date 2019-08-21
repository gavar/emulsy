import { Async } from "./types";

/**
 * Check if provided value is the {@link PromiseLike asynchronous}.
 * @param value - value to check.
 * @see PromiseLike
 */
export function isAsync<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  return value
    && typeof (value as PromiseLike<T>).then === "function";
}

/**
 * Check if provided value is the {@link Promise}
 * @param value - value to check.
 */
export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return value
    && typeof (value as Promise<T>).then === "function"
    && typeof (value as Promise<T>).catch === "function";
}

/**
 * Attaches resolution callback to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param fulfill - callback to execute when when value resolves.
 */
export function then<T, R>(async: T | PromiseLike<T>, fulfill: (value: T) => Async<R>): Async<R>;

/**
 * Attaches resolution callback to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param param - extra parameter to pass into {@param fulfill} along with value.
 * @param fulfill - callback to execute when when value resolves.
 */
export function then<T, R, P>(
  async: T | PromiseLike<T>,
  fulfill: (value: T, param: P) => Async<R>,
  param: P,
): Async<R>;

/**
 * Attaches resolution callback to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param params - extra parameters to pass into {@param fulfill} along with value.
 * @param fulfill - callback to execute when when value resolves.
 */
export function then<T, R, P extends any[]>(
  async: T | PromiseLike<T>,
  fulfill: (value: T, ...params: P) => Async<R>,
  params: P,
): Async<R>;

/**
 * Attaches callbacks to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param fulfill - callback to execute when asyncable resolves.
 * @param reject - callback to execute when asyncable rejects.
 */
export function then<T, R1, R2>(
  async: T | PromiseLike<T>,
  fulfill: (value: T) => Async<R1>,
  reject: (reason: any) => Async<R2>,
): Async<R1 | R2>;

/**
 * Attaches callbacks to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param fulfill - callback to execute when asyncable resolves.
 * @param param - extra parameter to pass into {@param fulfill} along with value.
 * @param reject - callback to execute when asyncable rejects.
 */
export function then<T, R1, P, R2>(
  async: T | PromiseLike<T>,
  fulfill: (value: T, param: P) => Async<R1>,
  param: P,
  reject: (reason: any) => Async<R2>,
): Async<R1 | R2>;

/**
 * Attaches callbacks to the potentially {@link isAsync asynchronous} value.
 * Calls {@param fulfill} synchronously when provided value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param fulfill - callback to execute when asyncable resolves.
 * @param params - extra parameters to pass into {@param fulfill} along with value.
 * @param reject - callback to execute when asyncable rejects.
 */
export function then<T, R1, P extends any[], R2>(
  async: T | PromiseLike<T>,
  fulfill: (value: T, ...params: P) => Async<R1>,
  params: P,
  reject: (reason: any) => Async<R1 | R2>,
): Async<R1 | R2>;

/**
 * Attaches rejection callback to the potentially {@link isAsync asynchronous} value.
 * Does nothing when value is not asynchronous.
 * @param async - value that may be asynchronous.
 * @param fulfill - nothing.
 * @param reject - callback to execute when asyncable rejects.
 */
export function then<T, R>(
  async: T | PromiseLike<T>,
  fulfill: undefined | null,
  reject: (reason: any) => Async<R>,
): Async<T | R>;

/** @private */
export function then<T, S = T>(
  async: Async<T>,
  fulfill: Fulfill<T, S>,
  params?: any,
  reject?: any,
): Async {
  // normalize arguments
  if (typeof params === "function" && arguments.length < 4) {
    reject = params;
    params = void 0;
  }

  // asyncable is a promise
  if (isAsync(async))
    return async.then(resolver(fulfill, params), reject);

  // asyncable is a value
  if (typeof fulfill === "function")
    return params !== void 0
      ? Array.isArray(params)
        ? fulfill(async, ...params)
        : fulfill(async, params)
      : fulfill(async);

  return async;
}

function resolver<T, R, P>(fulfill: Fulfill<T, R, P>, params: P): Fulfill<T, R> {
  if (typeof fulfill === "function")
    return params !== void 0
      ? Array.isArray(params)
        ? value => fulfill(value, ...params)
        : value => fulfill(value, params)
      : (fulfill as any);
}

type Fulfill<T, R, P = void> = P extends any[]
  ? (value: T, ...params: P) => Async<R>
  : (value: T, param?: P) => Async<R>;
