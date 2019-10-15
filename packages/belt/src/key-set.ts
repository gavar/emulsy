import { isKey } from "@emulsy/belt";

/**
 * Object containing unique set of values as keys.
 * Provides faster method for unique value lookup.
 * @see https://jsperf.com/object-vs-set-contains performance test
 */
export type KeySet<K extends keyof any = keyof any, V = any> = {
  [P in K]?: any;
}

export const KeySet: KeySetConstructor = Object.assign(KeySetFactory as any, {
  empty: Object.freeze({}),
});

export interface KeySetConstructor {
  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */
  new<K extends keyof any>(keys: K[]): KeySet<K, true>;

  /**
   * Create new instance of {@link KeySet} from provided key names.
   * @param keys - array of key names to use in a key set.
   */
  new<K extends keyof any>(...keys: K[]): KeySet<K, true>;

  /**.
   * Create new instance of {@link KeySet} with {@link Object.keys keys} of provided source object.
   * @param source - object containing keys to create key set from.
   */
  new<K extends keyof any>(source: Record<K, any>): KeySet<K, true>;

  /** Immutable empty instance of {@link KeySet}. */
  readonly empty: Readonly<KeySet>;
}

function KeySetFactory<K extends keyof any>(this: KeySet<K>, ...keys: K[]) {
  console.assert(new.target, "%s should be called with new!", KeySetFactory);
  keys = unwrap(keys) || keys;
  for (const key of keys) this[key] = true;
  return this;
}

function unwrap<T>(params: T[]): T[] {
  const [param] = params;
  if (params.length === 1 && !isKey(param))
    return Array.isArray(param) ? param
      : Object.keys(param) as any;
}
