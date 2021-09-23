/* eslint-disable consistent-return */

export function poll<T>({
  fn,
  validate,
  interval = 1000,
  maxAttempts = 100,
}: {
  fn: () => Promise<T>;
  validate: (args: T) => boolean;
  interval?: number;
  maxAttempts?: number;
}): [Promise<T>, () => void] {
  let attempts = 0;
  let stop = false;
  async function execute(
    resolve: (thenableOrResult?: PromiseLike<T> | T) => void,
    reject: (error?: string) => void
  ): Promise<T | void | null> {
    if (stop) {
      return;
    }
    attempts = attempts + 1;
    try {
      const res = await fn();
      if (validate(res)) {
        return resolve(res);
      }
      if (maxAttempts === attempts) {
        return reject('Hit max poll attempts');
      }
      setTimeout(execute, interval, resolve, reject);
    } catch (err) {
      return reject(err);
    }
  }
  function clear() {
    stop = true;
  }
  return [new Promise<T>(execute), clear];
}
