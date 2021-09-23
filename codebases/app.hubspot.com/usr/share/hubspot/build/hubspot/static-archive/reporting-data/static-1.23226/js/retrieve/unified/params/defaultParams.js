'use es6';

export var get = function get(spec) {
  return spec.defaultParams || {};
};