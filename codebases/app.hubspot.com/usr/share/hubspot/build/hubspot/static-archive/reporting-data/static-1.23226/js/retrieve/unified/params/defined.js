'use es6';

import { create } from './strings';
export var get = function get(spec, config) {
  var _spec$filters = spec.filters,
      filters = _spec$filters === void 0 ? {} : _spec$filters;
  return Object.keys(filters).reduce(function (params, property) {
    return Object.assign({}, params, {}, create(property).get(spec, config));
  }, {});
};