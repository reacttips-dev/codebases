/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Custom debounce function that accepts a function as the wait param
 * in order to apply dynamic waits.
 */

type Callback = (...args: any[]) => any;

// Wait function takes the same arguments as the source function but always
// returns a number
type DynamicWait<T> = T extends (...args: infer A) => any
  ? (...args: A) => number
  : unknown;

type Debounced<T> = T & {
  clear: () => void;
  flush: () => void;
};

interface DebounceOptions {
  immediate: boolean;
}

export const dynamicDebounce = function <T extends Callback>(
  func: T,
  wait: number | DynamicWait<T>,
  opts?: DebounceOptions,
): Debounced<T> {
  const immediate: boolean = (opts && opts.immediate) || false;
  let timeout: number | null;
  let result: any;
  let args: any;
  let context: any;

  const later = () => {
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };

  const isDynamic = (
    testWait: number | DynamicWait<T>,
  ): testWait is DynamicWait<T> => {
    return typeof testWait === 'function';
  };

  const debouncedFunc: Callback = function (this: any) {
    context = this;
    args = arguments;
    const callNow = immediate && !timeout;
    const delay = isDynamic(wait) ? wait.apply(context, args) : wait;

    if (timeout) {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, delay);

    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const flush = () => {
    if (timeout) {
      result = func.apply(context, args);
      clearTimeout(timeout);
      context = args = timeout = null;
    }
  };

  const debounced: Debounced<T> = (() => {
    const f: any = debouncedFunc;
    f.clear = clear;
    f.flush = flush;

    return f;
  })();

  return debounced;
};
