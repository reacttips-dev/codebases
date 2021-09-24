'use es6';
/**
 * `fn` is only run one time.
 *
 * @param  {Function} fn
 * @return {any}      the result of the first time `fn` was called
 */

export default function once(fn) {
  var didRun = false;
  var result;
  return function onced() {
    if (!didRun) {
      didRun = true;
      result = fn.apply(void 0, arguments);
    }

    return result;
  };
}