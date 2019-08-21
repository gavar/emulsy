import { NoSuchElementException } from "../exception";
import { Enumerator } from "./types";

/** Iterator which does not provide any elements. */
export class EmptyIterator<T = any> implements Enumerator<T, never> {

  /** Shared instance of the {@link EmptyIterator}. */
  static readonly instance = new EmptyIterator();

  /** @inheritdoc */
  get key(): never {
    throw new NoSuchElementException();
  }

  /** @inheritdoc */
  get hasNext(): false {
    return false;
  }

  /** @inheritdoc */
  next(): never {
    throw new NoSuchElementException();
  }
}
