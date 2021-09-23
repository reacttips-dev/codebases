'use es6'; // via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill

var isInteger = function isInteger(val) {
  return typeof val === 'number' && isFinite(val) && Math.floor(val) === val;
}; // via https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign#Polyfill


var sign = function sign(x) {
  return (x > 0) - (x < 0) || +x;
};

var range = function range() {
  var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var stop = arguments.length > 1 ? arguments[1] : undefined;
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  /* eslint-disable no-param-reassign */
  if (!stop) {
    stop = start;
    start = 0;
  }

  if (![start, stop, step].every(isInteger)) {
    throw new Error('Invalid array length');
  }

  if (step === 0) step = 1; // WHAT. Underscore does this so we have to for compatibility. WHAT.

  if (sign(stop - start) !== sign(step)) return [];
  var length = Math.abs((start - stop) / step);
  return Array.apply(null, Array(length)).map(function (_, i) {
    return start + step * i;
  });
};

export default range;