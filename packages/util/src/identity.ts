/** Returns 1st argument it receives. */
export function identity<T>($1: T): T { return $1; }

/** Returns 2nd argument it receives. */
export function identity2<T>($1: any, $2: T): T { return $2; }

/** Returns 3rd argument it receives. */
export function identity3<T>($1: any, $2: any, $3: T): T { return $3; }
