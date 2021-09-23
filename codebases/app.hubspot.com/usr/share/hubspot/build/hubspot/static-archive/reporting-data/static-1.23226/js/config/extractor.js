'use es6';

export default (function (extractFn, defaultValue) {
  return function (config) {
    var result = extractFn(config, defaultValue);
    return result === undefined ? defaultValue : result;
  };
});