'use es6';
/* eslint no-unused-vars: 0, prefer-rest-params: 0 */

import _enforceArity from '../internal/_enforceArity';
import _enforceFunction from '../internal/_enforceFunction';
/**
 * @private
 * Creates a function identical to `operation` with length `arity`.
 *
 * @param  {number} arity from 0 to 9
 * @param  {Function} operation
 * @return {Function}
 */

export default function _setArity(arity, operation) {
  _enforceArity(arity);

  _enforceFunction(operation); // The implementation here borrows pretty heavily from ramdajs.
  // https://github.com/ramda/ramda/blob/45bb9160b0aa2ed3bc5755d906024eb0337169a2/src/internal/_arity.js


  switch (arity) {
    case 0:
      return function arity0() {
        return operation.apply(void 0, arguments);
      };

    case 1:
      return function arity1(a) {
        return operation.apply(void 0, arguments);
      };

    case 2:
      return function arity2(a, b) {
        return operation.apply(void 0, arguments);
      };

    case 3:
      return function arity3(a, b, c) {
        return operation.apply(void 0, arguments);
      };

    case 4:
      return function arity4(a, b, c, d) {
        return operation.apply(void 0, arguments);
      };

    case 5:
      return function arity5(a, b, c, d, e) {
        return operation.apply(void 0, arguments);
      };

    case 6:
      return function arity6(a, b, c, d, e, f) {
        return operation.apply(void 0, arguments);
      };

    case 7:
      return function arity7(a, b, c, d, e, f, g) {
        return operation.apply(void 0, arguments);
      };

    case 8:
      return function arity8(a, b, c, d, e, f, g, h) {
        return operation.apply(void 0, arguments);
      };

    case 9:
      return function arity9(a, b, c, d, e, f, g, h, i) {
        return operation.apply(void 0, arguments);
      };

    default:
      return operation;
  }
}