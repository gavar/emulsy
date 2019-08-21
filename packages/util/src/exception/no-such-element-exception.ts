import { Exception } from "@emulsy/lang";

/**
 * Thrown by various accessor methods to indicate that the element being requested does not exist.
 * @see {@link https://docs.oracle.com/en/java/javase/12/docs/api/java.base/java/util/NoSuchElementException.html java.util.NoSuchElementException}
 */
export class NoSuchElementException extends Exception {

}
