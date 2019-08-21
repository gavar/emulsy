import { defer, Defer } from "../defer";
import { Async } from "../types";

export interface FindSelector<K, T, R> {
  (value: Async<T>, key: K): Async<R>;
}

export class Find<K, T, R> {
  done: boolean;
  private count: number;
  private promise: Defer<R>;
  private readonly selector: FindSelector<K, T, R>;
  private readonly defaultValue: Async<R>;

  constructor(defaultValue: Async<R>, selector: FindSelector<K, T, R>) {
    this.count = 0;
    this.promise = defer();
    this.selector = selector;
    this.defaultValue = defaultValue;
  }

  listen(test: Promise<boolean>, key: K, value: Async<T>): void {
    this.count++;
    test.then(match => this.consume(key, value, match), this.reject);
  }

  consume(key: K, value: Async<T>, match: boolean): void {
    if (!this.done)
      if (match)
        this.resolve(this.selector(value, key));
      else if (--this.count === 0)
        this.resolve(this.defaultValue);
  }

  resolve(value: Async<R>): void {
    this.done = true;
    this.promise.resolve(value);
  }

  reject = (reason: any): void => {
    this.done = true;
    this.promise.resolve(reason);
  };

  wait(): Promise<R> {
    return (this.promise = defer());
  }
}
