'use es6';

import invariant from './invariant';
export default (function (condition, message) {
  return function (fn) {
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'function';
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var warning = typeof message === 'string' ? message : typeof message === 'function' ? message.apply(void 0, args.concat([name])) : null;
      invariant(condition.apply(void 0, args), typeof warning === 'string' ? warning : "preconditions failed for " + name + " with arguments " + args);
      return fn.apply(void 0, args);
    };
  };
});