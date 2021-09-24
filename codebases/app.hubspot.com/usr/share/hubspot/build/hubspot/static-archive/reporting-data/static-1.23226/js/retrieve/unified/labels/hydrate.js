'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import prefix from '../../../lib/prefix';
import * as depth from '../depth';
import { createUnifiedTranslationKey } from '../../../properties/data-type/unified';

var noop = function noop() {
  return null;
};

var translate = prefix('reporting-data.properties.unified.people');

var person = function person(_ref) {
  var _ref$filters = _ref.filters;
  _ref$filters = _ref$filters === void 0 ? {} : _ref$filters;
  var _ref$filters$custom = _ref$filters.custom,
      custom = _ref$filters$custom === void 0 ? [] : _ref$filters$custom;
  var filter = custom.find(function (_ref2) {
    var property = _ref2.property;
    return property === 'peopleType';
  });
  return translate(filter ? filter.value : 'default');
};

export var get = function get(spec, config) {
  return function (_ref3) {
    var matrix = _ref3.matrix,
        references = _ref3.references;
    var keys = matrix.keys;

    var _depth$get = depth.get(spec, config),
        dimensionality = _depth$get.dimensionality,
        drilldown = _depth$get.drilldown;

    if (!drilldown) {
      return matrix;
    }

    var _config$dimensions = _slicedToArray(config.dimensions, 1),
        primary = _config$dimensions[0],
        dataType = config.dataType;

    var _drilldown$metadata = drilldown.metadata,
        metadata = _drilldown$metadata === void 0 ? {} : _drilldown$metadata,
        _drilldown$breakdowns = drilldown.breakdowns,
        breakdowns = _drilldown$breakdowns === void 0 ? {} : _drilldown$breakdowns;

    var translateProperty = function translateProperty(prop) {
      return prefix("reporting-data.properties." + createUnifiedTranslationKey(dataType))(prop);
    };

    var dimension = primary === 'people' ? person(config) : primary === 'deals-influenced' ? translate('deals-influenced') : spec.metadata && spec.metadata[primary] ? translateProperty(primary) : primary === 'sessionDate' ? null : drilldown.default;

    var lookup = function lookup(key) {
      return typeof breakdowns === 'object' ? breakdowns[key] || references[key] : references[key];
    };

    var label = metadata || breakdowns ? lookup : noop;
    return Object.assign({}, matrix, {
      labels: {
        dimensions: [dimension],
        keys: [dimensionality === 1 ? keys[0].map(label) : [], dimensionality === 2 ? keys[1].map(label) : []]
      }
    });
  };
};