import { Arrays } from "../arrays";
import { NoSuchElementException } from "../exception";
import { Enumerator } from "./types";

/** Iterator which allows to traverse {@link ArrayLike} objects. */
export class ArrayIterator<T> implements Enumerator<T, number> {

  /** Array of items to iterate. */
  private readonly items: ArrayLike<T>;

  /** Zero based index of the current element. */
  key: number;

  constructor(items: ArrayLike<T>) {
    this.key = -1;
    this.items = items || Arrays.empty;
  }

  /** @inheritdoc */
  get hasNext(): boolean {
    return this.items.length > this.key + 1;
  }

  /** @inheritdoc */
  next(): T {
    if (this.items.length > this.key + 1)
      return this.items[++this.key];
    throw new NoSuchElementException();
  }
}
