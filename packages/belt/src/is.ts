import { Falsy, Func, Nil, TypeOf } from "tstt";

export function isNil(value: any): value is Nil {
  return typeof value === "undefined" || value === null;
}

export function isNull(value: null | any): value is null {
  return value === null;
}

export function isUndefined(value: undefined | any): value is undefined {
  return typeof value === "undefined";
}

export function isBoolean(value: boolean | any): value is boolean {
  return typeof value === "boolean";
}

export function isNumber(value: number | any): value is number {
  return typeof value === "number";
}

export function isString(value: string | any): value is string {
  return typeof value === "string";
}

export function isSymbol(value: symbol | any): value is symbol {
  return typeof value === "symbol";
}

export function isObject<T = any>(value: Partial<T> | any): value is T {
  return typeof value === "object" && value;
}

export function isFunction<T extends Func = Func>(value: any): value is T {
  return typeof value === "function";
}

const keyType: Partial<Record<TypeOf, boolean>> = {
  number: true,
  string: true,
  symbol: true,
};

export function isKey<K extends keyof any>(key: K | any): key is K {
  return !!keyType[typeof key];
}

/**
 * Check if value is considered false when encountered in a {@link Boolean} context.
 * https://developer.mozilla.org/en-US/docs/Glossary/falsy
 */
export function isFalsy<T>(value: T | Falsy): value is Falsy {
  return !value;
}

/**
 * Check if value is considered true when encountered in a {@link Boolean} context.
 * https://developer.mozilla.org/en-US/docs/Glossary/truthy
 */
export function isTruthy<T>(value: T | Falsy): value is T {
  return !!value;
}
