/**
 * Iterator over a collection.
 * The name `Enumerator` chosen as an alternative native to {@link Iterator}.
 * @template T - type of elements returned by this iterator.
 * @see {@link https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/util/Iterator.html java.util.Iterator<T>}
 */
export interface Enumerator<T = any, K = keyof any> {

  /** Key of the last element returned by {@link next}. */
  readonly key: K;

  /** Whether the iteration has more elements. */
  readonly hasNext: boolean;

  /**
   * Returns the next element in the iteration.
   * @return the next element in the iteration.
   * @throws NoSuchElementException when the iteration has no more elements.
   */
  next(): T;
}
