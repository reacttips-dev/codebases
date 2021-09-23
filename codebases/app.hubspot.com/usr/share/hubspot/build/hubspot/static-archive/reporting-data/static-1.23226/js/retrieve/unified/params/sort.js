'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var get = function get(spec, config) {
  var _spec$metadata = spec.metadata,
      metadata = _spec$metadata === void 0 ? {} : _spec$metadata;
  var _config$sort = config.sort;
  _config$sort = _config$sort === void 0 ? [] : _config$sort;

  var _config$sort2 = _slicedToArray(_config$sort, 1),
      _config$sort2$ = _config$sort2[0];

  _config$sort2$ = _config$sort2$ === void 0 ? {} : _config$sort2$;
  var property = _config$sort2$.property,
      sortDir = _config$sort2$.order;
  var properties = Object.keys(metadata);
  var sort = properties.includes(property) ? "metadata-" + property : property;
  return {
    sort: sort,
    sortDir: sortDir
  };
};