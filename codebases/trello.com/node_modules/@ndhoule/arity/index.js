'use strict';

var objToString = Object.prototype.toString;

/**
 * Determine if a value is a function.
 *
 * @param {*} val
 * @return {boolean}
 */
// TODO: Move to lib
var isFunction = function(val) {
  return typeof val === 'function';
};

/**
 * Determine if a value is a number.
 *
 * @param {*} val
 * @return {boolean}
 */
// TODO: Move to lib
var isNumber = function(val) {
  var type = typeof val;
  return type === 'number' || (type === 'object' && objToString.call(val) === '[object Number]');
};

 /**
  * Creates an array of generic, numbered argument names.
  *
  * @name createParams
  * @api private
  * @param {number} n
  * @return {Array}
  * @example
  * argNames(2);
  * //=> ['arg1', 'arg2']
  */
var createParams = function createParams(n) {
  var args = [];

  for (var i = 1; i <= n; i += 1) {
    args.push('arg' + i);
  }

  return args;
};

 /**
  * Dynamically construct a wrapper function of `n` arity that.
  *
  * If at all possible, prefer a function from the arity wrapper cache above to
  * avoid allocating a new function at runtime.
  *
  * @name createArityWrapper
  * @api private
  * @param {number} n
  * @return {Function(Function)}
  */
var createArityWrapper = function createArityWrapper(n) {
  var paramNames = createParams(n).join(', ');
  var wrapperBody = ''.concat(
    '  return function(', paramNames, ') {\n',
    '    return func.apply(this, arguments);\n',
    '  };'
  );

  /* eslint-disable no-new-func */
  return new Function('func', wrapperBody);
  /* eslint-enable no-new-func */
};

// Cache common arity wrappers to avoid constructing them at runtime
var arityWrapperCache = [
  /* eslint-disable no-unused-vars */
  function(fn) {
    return function() {
      return fn.apply(this, arguments);
    };
  },

  function(fn) {
    return function(arg1) {
      return fn.apply(this, arguments);
    };
  },

  function(fn) {
    return function(arg1, arg2) {
      return fn.apply(this, arguments);
    };
  },

  function(fn) {
    return function(arg1, arg2, arg3) {
      return fn.apply(this, arguments);
    };
  },

  function(fn) {
    return function(arg1, arg2, arg3, arg4) {
      return fn.apply(this, arguments);
    };
  },

  function(fn) {
    return function(arg1, arg2, arg3, arg4, arg5) {
      return fn.apply(this, arguments);
    };
  }
  /* eslint-enable no-unused-vars */
];

/**
 * Takes a function and an [arity](https://en.wikipedia.org/wiki/Arity) `n`, and returns a new
 * function that expects `n` arguments.
 *
 * @name arity
 * @api public
 * @category Function
 * @see {@link curry}
 * @param {Number} n The desired arity of the returned function.
 * @param {Function} fn The function to wrap.
 * @return {Function} A function of n arity, wrapping `fn`.
 * @example
 * var add = function(a, b) {
 *   return a + b;
 * };
 *
 * // Check the number of arguments this function expects by accessing `.length`:
 * add.length;
 * //=> 2
 *
 * var unaryAdd = arity(1, add);
 * unaryAdd.length;
 * //=> 1
 */
var arity = function arity(n, func) {
  if (!isFunction(func)) {
    throw new TypeError('Expected a function but got ' + typeof func);
  }

  n = Math.max(isNumber(n) ? n : 0, 0);

  if (!arityWrapperCache[n]) {
    arityWrapperCache[n] = createArityWrapper(n);
  }

  return arityWrapperCache[n](func);
};

/*
 * Exports.
 */

module.exports = arity;
