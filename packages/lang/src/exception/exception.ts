/** Base class for all exceptions. */
export class Exception implements Error {
  /** Name for the type of error. */
  name: string;

  /**  Human-readable description of the error. */
  message: string;

  /** Stacktrace of exceptions occurrence. */
  stack?: string;

  /**
   * An error that caused this exception to get thrown, or null if this
   * exception was not caused by another error, or if the causative
   * error is unknown. If this field is equal to this exception itself,
   * it indicates that the cause of this throwable has not yet been
   * initialized.
   */
  cause?: Error;

  /**
   * Initialize new instance of an exception.
   * @param message - human-readable message describing an error.
   * @param cause - an error that caused this exception to get thrown.
   */
  constructor(message?: string, cause?: Error) {
    if (message) this.message = message;
    if (cause) this.cause = cause;
    this.name = this.constructor.name;
    Error.captureStackTrace(this);
  }
}

(function (prototype: Exception) {
  prototype.name = Exception.name;
  prototype.message = "unhandled exception";
  Object.setPrototypeOf(prototype, Error.prototype);
}(Exception.prototype));
