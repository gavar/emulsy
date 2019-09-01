/**
 * Binds a function of the given target object to self.
 */
export function closure<T extends Function>(target: object, key: keyof any,
                                            descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  const {get, set, value, writable, ...options} = descriptor;
  descriptor = {
    ...options,
    get() {
      // access directly on the prototype where it is actually defined
      // prototype.hasOwnProperty(key)
      if (this === target)
        return value;

      // access directly on the prototype, but but it was found up the chain
      // prototype.hasOwnProperty(key) == false && key in prototype
      if (this.constructor !== target.constructor &&
        Object.getPrototypeOf(this).constructor === target.constructor)
        return value;

      return Object.defineProperty(this, key, {
        ...options,
        writable,
        value: value.bind(this),
      })[key];
    },
  };

  // setter
  if (writable)
    descriptor.set = function (value: T) {
      Object.defineProperty(this, key, {
        ...options,
        writable,
        value,
      });
    };

  return descriptor;
}
