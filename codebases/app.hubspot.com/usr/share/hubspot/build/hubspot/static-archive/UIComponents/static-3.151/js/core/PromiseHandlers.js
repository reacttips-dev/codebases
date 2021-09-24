'use es6';
/**
 * Useful when a rejection may be called with a non-Error value.
 * Throws an instance of window.Error, but returns any other value.
 *
 * @param  {any}
 * @return {any}
 */

export function rethrowError(err) {
  if (err instanceof Error) {
    throw err;
  }

  return err;
}