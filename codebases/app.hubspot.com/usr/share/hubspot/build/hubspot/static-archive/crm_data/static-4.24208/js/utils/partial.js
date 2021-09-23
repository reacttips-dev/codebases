'use es6';
/**
 * Adapted from Underscore 1.6.0 _.partial https://github.com/jashkenas/underscore/blob/1.6.0/underscore.js#L629-640
 * Unlike transmute/partial and react-utils/partial, this version should preserve the context of `this`.
 */

/* eslint-disable prefer-rest-params */

export default function (func) {
  var boundArgs = Array.prototype.slice.call(arguments, 1);
  return function () {
    var position = 0;
    var args = boundArgs.slice();

    while (position < arguments.length) {
      args.push(arguments[position++]);
    }

    return func.apply(this, args);
  };
}