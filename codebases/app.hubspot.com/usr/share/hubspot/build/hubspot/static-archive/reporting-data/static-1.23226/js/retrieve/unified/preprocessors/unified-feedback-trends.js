'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fill } from '../endpoints/fill';

var check = function check(points) {
  return Boolean(points) && points.some(function (_ref) {
    var score = _ref.score;
    return score != null;
  });
};

var trailingSustain = function trailingSustain(spec, config) {
  return function (response) {
    var started = false;
    return fill(function (_ref2) {
      var previous = _ref2.previous;
      started = started || check(previous);
      return started ? previous : [{
        score: null
      }];
    })(spec, config)(response);
  };
};

export var preprocess = function preprocess(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions;
    _config$dimensions = _config$dimensions === void 0 ? [] : _config$dimensions;

    var _config$dimensions2 = _slicedToArray(_config$dimensions, 1),
        primary = _config$dimensions2[0];

    return primary === 'sessionDate' ? trailingSustain(spec, config)(response) : response;
  };
};