function argsToJsonHasher() {
  const args = Array.prototype.slice.call(arguments);
  return JSON.stringify(args);
}

/**
 * Memoize a function by caching the results in memory and looking up cached
 * result using the function's inputs.
 *
 * Can pass in an optioner hasher function as the second parameter to modify
 * the keys used for caching
 *
 * The memoized function has 2 methods defined:
 * - force: apply the function without using the cache and put result in cache
 * - clear: clear memo
 *
 * Largely based on underscore's implementation of memoize
 *
 * @param  {Function} func      Function to be memoized
 * @param  {Function} [hasher]  Options custom hasher function
 * @return {Function}           Memoized Function
 */
export default function (func, hasher = argsToJsonHasher) {
  let memo = {};

  const memoized = function () {
    const key = hasher.apply(this, arguments);
    if (!memo.hasOwnProperty(key)) {
      memo[key] = func.apply(this, arguments);
    }
    return memo[key];
  };

  memoized.force = function () {
    memoized.clear.apply(this, arguments);
    return memoized.apply(this, arguments);
  };

  memoized.clear = function () {
    const key = hasher.apply(this, arguments);
    delete memo[key];
  };

  memoized.reset = function () {
    memo = {};
  };

  return memoized;
}
