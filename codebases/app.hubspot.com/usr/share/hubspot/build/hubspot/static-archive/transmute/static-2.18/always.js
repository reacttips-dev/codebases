'use es6';
/**
 * Creates a function that always returns `returnValue`.
 *
 * @example
 * const alwaysBlue = always('blue');
 * alwaysBlue() === 'blue';
 *
 * @param  {T} returnValue
 * @return {T}
 */

export default function always(returnValue) {
  return function () {
    return returnValue;
  };
}