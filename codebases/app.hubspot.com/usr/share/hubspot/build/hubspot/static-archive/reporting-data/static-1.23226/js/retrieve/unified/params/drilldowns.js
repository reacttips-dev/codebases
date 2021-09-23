'use es6';

import { create } from './strings';

var empty = function empty(object) {
  return Object.keys(object).length === 0;
};

export var get = function get(spec, config) {
  var _spec$d = spec.d1,
      d1 = _spec$d === void 0 ? {} : _spec$d,
      _spec$d2 = spec.d2,
      d2 = _spec$d2 === void 0 ? {} : _spec$d2;
  return Object.assign({}, empty(d1) ? {} : create('d1').get(spec, config), {}, empty(d2) ? {} : create('d2').get(spec, config));
};