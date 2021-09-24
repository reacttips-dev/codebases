'use es6';

import aggregator from './aggregator';
export default (function (target, eventName) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return aggregator(function (fn) {
    target.addEventListener(eventName, fn, opts);
    return function () {
      target.removeEventListener(eventName, fn, opts);
    };
  });
});