'use es6';
/*
 * TODO: need to determine how to better handle count vs. total
 */

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export var zero = function zero(_ref) {
  var metrics = _ref.metrics,
      data = _ref.data,
      total = _ref.total;
  return {
    metrics: data.reduce(function (nested, value, d0) {
      return Object.assign({}, nested, _defineProperty({}, metrics[d0][0], _defineProperty({}, metrics[d0][1], value)));
    }, {}),
    total: total[0]
  };
};
export var one = function one(_ref2) {
  var dimensions = _ref2.dimensions,
      metrics = _ref2.metrics,
      keys = _ref2.keys,
      data = _ref2.data,
      total = _ref2.total,
      totals = _ref2.totals,
      labels = _ref2.labels;
  return Object.assign({
    dimension: Object.assign({
      property: dimensions[0],
      buckets: data.map(function (series, d0) {
        return Object.assign({
          key: keys[0][d0],
          metrics: series.reduce(function (bucket, value, d1) {
            return Object.assign({}, bucket, _defineProperty({}, metrics[d1][0], _defineProperty({}, metrics[d1][1], value)));
          }, {})
        }, labels && labels.keys && labels.keys.length > 0 ? {
          keyLabel: labels.keys[0][d0]
        } : {});
      })
    }, labels && labels.dimensions ? {
      propertyLabel: labels.dimensions[0]
    } : {})
  }, totals ? {
    metrics: metrics.reduce(function (memo, metric, index) {
      return Object.assign({}, memo, _defineProperty({}, metric[0], _defineProperty({}, metric[1], totals[index])));
    }, {})
  } : {}, {
    total: total[0] || keys[0].length
  });
};
export var two = function two(_ref3) {
  var dimensions = _ref3.dimensions,
      metrics = _ref3.metrics,
      keys = _ref3.keys,
      data = _ref3.data,
      total = _ref3.total,
      labels = _ref3.labels;
  return {
    dimension: {
      property: dimensions[0],
      buckets: data.map(function (outer, d0) {
        return {
          key: keys[0][d0],
          dimension: {
            property: dimensions[1],
            buckets: outer.map(function (inner, d1) {
              return Object.assign({
                key: keys[1][d1],
                metrics: inner.reduce(function (bucket, value, d2) {
                  return Object.assign({}, bucket, _defineProperty({}, metrics[d2][0], _defineProperty({}, metrics[d2][1], value)));
                }, {})
              }, labels && labels.keys && labels.keys.length > 1 ? {
                keyLabel: labels.keys[1][d1]
              } : {});
            })
          }
        };
      })
    },
    total: total[0] || keys[0].length
  };
};