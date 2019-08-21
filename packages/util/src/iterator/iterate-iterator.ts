import { NoSuchElementException } from "../exception";
import { Enumerator } from "./types";

/** Adapts native {@link Iterator} to {@link Enumerator}  */
export class IterateIterator<T> implements Enumerator<T, never> {

  private value: T;
  private readonly iterator: Iterator<T>;

  /** @inheritdoc */
  key: never;

  /** @inheritdoc */
  hasNext: boolean;

  constructor(iterator: Iterator<T>) {
    const {done, value} = iterator.next();
    this.value = value;
    this.hasNext = !done;
    this.iterator = iterator;
  }

  /** @inheritdoc */
  next(): T {
    if (this.hasNext) {
      const {done, value} = this.iterator.next();
      this.hasNext = !done;
      return this.value = value;
    }
    throw new NoSuchElementException();
  }
}
