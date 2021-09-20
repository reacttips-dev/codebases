/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Custom throttle function that accepts a function
 * and a minimum milliseconds between invocations
 * implementation based on underscore.js throttle:
 * https://underscorejs.org/docs/modules/throttle.html
 */

interface ThrottledFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the throttle rules.
   *
   * If the throttled function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invokation
   */
  (...args: Parameters<T>): ReturnType<T>;

  /**
   * If there an outstanding function call, cancel it
   */
  cancel: () => void;
}

export const throttle = function <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ThrottledFunc<T> {
  let lastInvokeTime = 0;
  let timeoutId: number | null;
  let result: ReturnType<T>;
  let context: any;

  const throttledFunction: ThrottledFunc<T> = function (this: any, ...args) {
    context = this;

    const time = Date.now();
    const timeSinceLastInvoke = time - lastInvokeTime;

    if (timeSinceLastInvoke > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastInvokeTime = time;
      // @ts-ignore
      result = func.apply(context, ...args);
      context = null;
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        lastInvokeTime = Date.now();
        // @ts-ignore
        result = func.apply(context, ...args);
        context = null;
      }, wait - timeSinceLastInvoke);
    }

    return result;
  };

  throttledFunction.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      context = null;
    }
  };

  return throttledFunction;
};
