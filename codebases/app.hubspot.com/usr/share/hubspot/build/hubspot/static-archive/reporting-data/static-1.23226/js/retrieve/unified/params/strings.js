'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { has } from '../../../lib/has';
export var create = function create(name, field) {
  return {
    get: function get(spec, config) {
      var _config$filters = config.filters;
      _config$filters = _config$filters === void 0 ? {} : _config$filters;
      var _config$filters$custo = _config$filters.custom,
          custom = _config$filters$custo === void 0 ? [] : _config$filters$custo;
      return custom.reduce(function (memo, filter) {
        var property = filter.property,
            value = filter.value,
            values = filter.values;

        if (property !== name) {
          return memo;
        }

        var key = typeof field === 'function' ? field(filter) : field || name;

        if (!has(memo, key)) {
          memo[key] = [];
        }

        memo[key] = [].concat(_toConsumableArray(memo[key]), _toConsumableArray(value != null ? [value] : values));
        return memo;
      }, {});
    }
  };
};