"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createMetricsFactory", {
  enumerable: true,
  get: function get() {
    return _createMetricsFactory.createMetricsFactory;
  }
});
Object.defineProperty(exports, "setStaticAppInfo", {
  enumerable: true,
  get: function get() {
    return _metricsApi.setStaticAppInfo;
  }
});

var _createMetricsFactory = require("./internal/createMetricsFactory");

var _metricsApi = require("./internal/metricsApi");