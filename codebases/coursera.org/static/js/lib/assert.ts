/**
 * A very basic assertion method that makes runtime checks easier.
 *
 * `assert` returns it expression so you can use it in assignments:
 *
 *   var item = assert(store.get(itemId), new exceptions.NotFound());
 */

export default function assert<T>(expression: T | null | undefined, error: Error | string = new Error()): T {
  if (!expression) {
    if (typeof error === 'string') {
      throw new Error(error);
    } else {
      throw error;
    }
  }

  return expression;
}
