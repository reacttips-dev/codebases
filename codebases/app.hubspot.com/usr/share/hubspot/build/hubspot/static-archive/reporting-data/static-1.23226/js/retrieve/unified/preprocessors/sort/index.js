'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { has } from '../../../../lib/has';
import { comparator } from './comparator';

var breakdown = function breakdown(spec, config) {
  return function (response) {
    var _spec$metrics = spec.metrics,
        metrics = _spec$metrics === void 0 ? {} : _spec$metrics,
        _spec$metadata = spec.metadata,
        properties = _spec$metadata === void 0 ? {} : _spec$metadata;
    var _config$sort = config.sort;
    _config$sort = _config$sort === void 0 ? [] : _config$sort;

    var _config$sort2 = _slicedToArray(_config$sort, 1),
        _config$sort2$ = _config$sort2[0];

    _config$sort2$ = _config$sort2$ === void 0 ? {} : _config$sort2$;
    var property = _config$sort2$.property,
        order = _config$sort2$.order;
    var _response$breakdowns = response.breakdowns,
        breakdowns = _response$breakdowns === void 0 ? [] : _response$breakdowns;
    var getter = has(metrics, property) ? function (fields) {
      return fields[property];
    } : has(properties, property) ? function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$metadata = _ref.metadata,
          fields = _ref$metadata === void 0 ? {} : _ref$metadata;

      return fields[property];
    } : null;
    return getter ? Object.assign({}, response, {
      breakdowns: breakdowns.sort(comparator(getter, order))
    }) : response;
  };
};

export var get = function get(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions,
        dimensions = _config$dimensions === void 0 ? [] : _config$dimensions,
        _config$sort3 = config.sort;
    _config$sort3 = _config$sort3 === void 0 ? [] : _config$sort3;

    var _config$sort4 = _slicedToArray(_config$sort3, 1),
        sort = _config$sort4[0];

    if (sort == null) {
      return response;
    }

    return dimensions[0] === 'sessionDate' ? response : breakdown(spec, config)(response);
  };
};