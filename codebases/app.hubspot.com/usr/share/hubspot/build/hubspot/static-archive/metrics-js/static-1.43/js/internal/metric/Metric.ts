"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metric = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Metric = /*#__PURE__*/function () {
  function Metric(name, dimensions) {
    (0, _classCallCheck2.default)(this, Metric);
    this.name = name;
    this.dimensions = dimensions;
  }

  (0, _createClass2.default)(Metric, [{
    key: "getDimensions",
    value: function getDimensions() {
      return this.dimensions;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.name;
    }
  }, {
    key: "getSeries",
    value: function getSeries(qualifier) {
      return [this.name, qualifier].join('.');
    }
  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify({
        name: this.getName(),
        dimensions: this.getDimensions()
      }, null, 2);
    }
  }]);
  return Metric;
}();

exports.Metric = Metric;