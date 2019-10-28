import { isKey } from "./is";

/**
 * Object containing unique set of values as keys.
 * Provides faster method for unique value lookup.
 * @see https://jsperf.com/object-vs-set-contains performance test
 */
export type KeySet<K extends keyof any = keyof any, V = any> = {
  [P in K]?: V;
}

/**
 * KeySet is an object containing keys with any.
 * Proven to be fastest way for key lookup.
 * @see https://jsperf.com/object-vs-set-contains
 */
export const KeySet = function <K extends keyof any>(this: KeySet<K>, ...params: K[]) {
  const set = new.target ? this : {} as KeySet<K>;
  const keys = toKeys(params);
  for (const key of keys) set[key] = true;
  return set;
} as KeySetConstructor;

Object.assign(KeySet, {
  empty: Object.freeze({}),
} as KeySetConstructor);

export interface KeySetConstructor {
  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */
  new<K extends keyof any>(keys: K[]): KeySet<K, true>;

  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */<K extends keyof any>(keys: K[]): KeySet<K, true>;

  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */
  new<K extends keyof any>(...keys: K[]): KeySet<K, true>;

  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */<K extends keyof any>(...keys: K[]): KeySet<K, true>;

  /**.
   * Create new instance of {@link KeySet} with {@link Object.keys keys} of provided source object.
   * @param source - object containing keys to create key set from.
   */
  new<K extends keyof any>(source: Record<K, any>): KeySet<K, true>;

  /**.
   * Create new instance of {@link KeySet} with {@link Object.keys keys} of provided source object.
   * @param source - object containing keys to create key set from.
   */<K extends keyof any>(source: Record<K, any>): KeySet<K, true>;

  /** Immutable empty instance of {@link KeySet}. */
  readonly empty: Readonly<KeySet>;
}

function toKeys<T>(params: T[]): T[] {
  if (params.length === 1) {
    const [param] = params;
    if (!isKey(param))
      return Array.isArray(param) ? param
        : Object.keys(param) as any;
  }
  return params;
}
