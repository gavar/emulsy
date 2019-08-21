import { Newable } from "tstt";

/**
 * Evaluate property getter function and cache the result.
 * @param prototype - object prototype containing getter.
 * @param key - name of the property getter.
 * @param descriptor - property descriptor.
 * @return modified property descriptor which cache result on first call.
 */
export function lazy<T, K extends keyof any>(prototype: Record<K, T> | any, key: K, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  if (descriptor.get)
    return lazyGetter(key, descriptor);

  throw new Error("lazy should only be used on property getter");
}

export namespace lazy {
  /**
   * Lazily create new instance using provided constructor when property accessed for the first time and cache the result.
   * @param ctor - function to use for constructing new instance via `new` keyword.
   * @param params - parameters to pass to a constructor.
   */
  export function ctor<T, P extends any[] = never>(ctor: new (...params: P) => T, ...params: P): PropertyDecorator<T> {
    return lazyFactory(true, ctor, params);
  }

  /**
   * Lazily evaluates factory when property accessed for the first time and cache the result.
   * Allows to use `this` to access instance properties for calculations.
   * @param factory - function calculating result to be cached.
   * @param params - parameters to pass to a function.
   */
  export function factory<T, P extends any[] = never>(factory: (...params: P) => T, ...params: P): PropertyDecorator<T> {
    return lazyFactory(false, factory, params);
  }
}

interface PropertyDecorator<T> {
  <K extends keyof any>(prototype: Record<K, T>, key: K): void;
}

const CONFIGURABLE: PropertyDescriptor = {
  configurable: true,
  enumerable: true,
};

const WRITABLE: PropertyDescriptor = {
  ...CONFIGURABLE,
  writable: true,
};

function lazyGetter<T, K extends keyof any>(key: K, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  const {get, set, ...rest} = descriptor;
  if (set) throw new Error("setter is not yet supported for lazy getter");

  return {
    ...rest,
    get() {
      const value = get.apply(this);
      Object.defineProperty(this, key, {...rest, value: value});
      return value;
    },
  };
}

function lazyFactory<T>(constructor: boolean, factory: Function | Newable, params: any[]): PropertyDecorator<T> {
  return function <K extends keyof any>(prototype: any, key: K, descriptor?: undefined) {
    if (descriptor)
      throw new Error("lazy factory should only be used as property decorator");

    function set(this: Record<K, T>, value: T) {
      Object.defineProperty(this, key, {...WRITABLE, value});
    }

    function get(this: Record<K, T>): T {
      const value = constructor ? new (factory as Newable)(...params) : factory.apply(this, params);
      Object.defineProperty(this, key, {...WRITABLE, value});
      return value;
    }

    return {...CONFIGURABLE, set, get};
  };
}
