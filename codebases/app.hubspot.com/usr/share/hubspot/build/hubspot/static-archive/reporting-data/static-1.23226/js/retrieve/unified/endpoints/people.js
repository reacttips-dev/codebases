'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { has } from '../../../lib/has';
import { pairs } from './metrics';
import { one } from './downgrade';

var getPeopleType = function getPeopleType(_ref) {
  var _ref$filters = _ref.filters;
  _ref$filters = _ref$filters === void 0 ? {} : _ref$filters;
  var _ref$filters$custom = _ref$filters.custom,
      custom = _ref$filters$custom === void 0 ? [] : _ref$filters$custom;
  var filter = custom.find(function (_ref2) {
    var property = _ref2.property;
    return property === 'peopleType';
  });
  return filter ? filter.value : 'visits';
};

var parse = function parse(spec, config) {
  return function (response) {
    var dimensions = config.dimensions,
        _config$metrics = config.metrics,
        metrics = _config$metrics === void 0 ? [] : _config$metrics;
    var total = response.total,
        people = response.people;
    var keys = people.map(function (_ref3) {
      var vid = _ref3.vid;
      return vid;
    });
    var remapped = people.reduce(function (mapped, person) {
      return Object.assign({}, mapped, _defineProperty({}, person.vid, person));
    }, {});
    var matrix = {
      dimensions: dimensions,
      metrics: pairs(config),
      keys: [keys],
      data: keys.map(function (key) {
        return metrics.map(function (_ref4) {
          var property = _ref4.property;
          return has(remapped, key) ? has(remapped[key], property) ? remapped[key][property] : has(remapped[key].metadata, property) ? remapped[key].metadata[property] : null : null;
        });
      }),
      total: [total]
    };
    return {
      response: response,
      matrix: matrix
    };
  };
};

export var get = function get(spec, config) {
  return {
    url: spec.url + "/people/" + getPeopleType(config),
    parse: parse(spec, config),
    downgrade: one
  };
};