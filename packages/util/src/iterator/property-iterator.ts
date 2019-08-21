import { Arrays } from "../arrays";
import { NoSuchElementException } from "../exception";
import { Enumerator } from "./types";

/** Iterator which allows to traverse object values. */
export class PropertyIterator<K extends keyof any, T> implements Enumerator<T, K> {

  /** Object keys to iterate. */
  private readonly keys: ReadonlyArray<K>;

  /** Object being iterated. */
  private readonly object: Record<K, T>;

  /** Zero based index of the current key. */
  private index: number;

  /** @inheritdoc */
  key: K;

  constructor(object: Record<K, T>, keys: ReadonlyArray<K> = Object.keys(object) as any) {
    this.index = -1;
    this.keys = keys || Arrays.empty;
    this.object = object;
  }

  /** @inheritdoc */
  get hasNext(): boolean {
    return this.keys.length > this.index + 1;
  }

  /** @inheritdoc */
  next(): T {
    if (this.keys.length > this.index + 1) {
      this.key = this.keys[++this.index];
      return this.object[this.key];
    }
    throw new NoSuchElementException();
  }
}
