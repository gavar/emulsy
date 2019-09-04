import { Newable, Abstract } from "tstt";

/**
 * Type identifier for runtime types affected by type erasure (interfaces, type definitions, etc).
 * Possible way to use interface as type, thankfully to typescript declaration merging feature.
 *
 * Consider following example code:
 *
 * @example
 * export interface Example { ... }
 * export namespace Example {
 *   declare const $Type: Example;
 *   declare const $TypeName: "Example";
 * }
 */
export interface InterfaceType<T = any> {
  /**
   * Property value declaring instance type of the bean.
   * Value is not used during runtime and required only for type checking.
   */
  readonly $Type: T;

  /** Display name of the bean. */
  readonly $TypeName: string;
}

export function isInterfaceType<T>(value: Partial<InterfaceType<T>>): value is InterfaceType<T> {
  return value && typeof value.$TypeName === "string";
}

/** Type definition which allows to identify types in IoC containers. */
export type TypeDef<T = any> =
  | Newable<T>
  | Abstract<T>
  | InterfaceType<T>
  | symbol
  | string
  ;

export namespace TypeDef {
  /**
   * Determines whether the {@param type} derives from {@param base} type.
   * @param type - type to check.
   * @param base - type to compare with.
   */
  export function is<T>(type: TypeDef<T>, base: TypeDef<T>): boolean {
    if (type && base) {
      // equal? (covers interface equality)
      if (type === base)
        return true;
      // prototype inheritance?
      if (typeof type === "function")
        return isPrototypeOf(base as Function, type);
    }
    return false;
  }

  /**
   * Get type of the given object.
   * Alternative to a native <code>typeof</code>
   * @param value - instance value of which to get type.
   * @param interfaceType - type to use if provided value doesn't have constructor and evaluates to pure 'object' type.
   */
  export function of<T>(value: T, interfaceType?: InterfaceType<T>): TypeDef<T> {
    if (value)
      switch (typeof value) {
        case "string":
        case "symbol":
        case "function":
          return value;
        case "object":
          const {constructor} = value;
          // prefer interface type over object constructor
          if (constructor == null || value.constructor === Object) {
            if (interfaceType) return interfaceType;
            if (isInterfaceType<T>(value)) return value;
          }
          // use object constructor as a type
          return constructor;
      }
  }

  /**
   * Get name of the type definition.
   * @param type - type definition.
   */
  export function name<T>(type: TypeDef<T>): string | undefined {
    if (type)
      switch (typeof type) {
        case "string":
          return type;
        case "symbol":
          return type.toString();
        case "function":
          return (type as Function).name;
        case "object":
          return (type as InterfaceType).$TypeName;
      }
  }
}

function isPrototypeOf(type: Function, base: Function) {
  if (type && type.prototype && base.prototype)
    return type.prototype.isPrototypeOf(base.prototype);
  return false;
}
