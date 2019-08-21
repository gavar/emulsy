export interface MemoizeOptions {
  /**
   * Check whether two values are equals.
   * @param a - first value to check.
   * @param b - second value to check.
   * @default {@link Object.is ReferenceEquality}
   */
  is(a: any, b: any): boolean;
}

/** Default memoization options. */
export const MemoizeOptions: MemoizeOptions = {
  is: Object.is,
};

/**
 * Annotation to use for memoization of the last result on a property or method of a class.
 *
 * When set on property accessor:
 * - saves result of the first invocation in the field with the same name;
 * - since property is part of prototype, but result is set on `this`, think of converting property to a value.
 *
 * When set on method:
 * - replaces a target method with memoization function that calls underlying function only when argument changes.
 * - reference equality comparison being by default for checking whether arguments have changed or not.
 *
 * @param prototype - object prototype containing property or method.
 * @param key - name of the property or method result of which to remember.
 * @param descriptor - property descriptor.
 */
export function memoize<T>(this: void | MemoizeOptions, prototype: object, key: keyof any, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  // wrap function with memoization
  if (typeof descriptor.value === "function")
    return memoizeFunction(this || MemoizeOptions, key, descriptor) as any;

  // remember only first getter invocation since getter has no arguments
  if (descriptor.get)
    if (descriptor.set) throw new Error("unable to use memoization when property setter present");
    else return memoizeGetter(key, descriptor);
}

export namespace memoize {
  /**
   * Configure {@link memoize} to override default options.
   * @param options - options to override in {@link MemoizeOptions default} configuration.
   */
  export function $(options?: Partial<MemoizeOptions>) {
    return options
      ? memoize.bind({...MemoizeOptions, ...options})
      : memoize;
  }

  /** Memoization with shallow comparison. */
  export const shallow = $({
    is: shallowEquals,
  });
}

function memoizeGetter<T>(key: keyof any, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  const {get, ...options} = descriptor;
  return {
    ...options,
    get() {
      return Object.defineProperty(this, key, {
        ...options,
        value: get.apply(this),
      })[key];
    },
  };
}

interface Invocation {
  args?: any[];
  result?: any;
}

const byFunction = new WeakMap<Function, WeakMap<object, Invocation>>();

function invocationOf(object: object, func: Function): Invocation {
  // invocations of a function
  let byObject = byFunction.get(func);
  if (!byObject) {
    byObject = new WeakMap<object, Invocation>();
    byFunction.set(func, byObject);
  }

  // invocation of a function on a particular object
  let invocation = byObject.get(object);
  if (!invocation) {
    invocation = {args: []};
    byObject.set(object, invocation);
  }

  return invocation;
}

function memoizeFunction(options: MemoizeOptions, key: keyof any, descriptor: PropertyDescriptor): PropertyDescriptor {
  const {is} = options;
  const {value} = descriptor;
  return {
    ...descriptor,
    value(...args: any[]) {
      // find previous invocation
      const last = invocationOf(this, value);
      // invoke when arguments changes
      if (areDifferentArrays(last.args, args, is)) {
        last.args = args;
        last.result = value.apply(this, args);
      }
      return last.result;
    },
  };
}

function areDifferentArrays(a: any[], b: any[], equal: (a: any, b: any) => boolean) {
  let {length} = a;
  if (length !== b.length)
    return true;

  while (--length >= 0)
    if (!equal(a[length], b[length]))
      return true;
}

function shallowEquals(a: any, b: any): boolean {
  if (a !== b) {
    if (!a || !b) return false;
    for (const k in a) if (!(k in b)) return false;
    for (const k in b) if (a[k] !== b[k]) return false;
  }
  return true;
}
