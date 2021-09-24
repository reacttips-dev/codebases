'use es6';

import * as inboundDbDataTypes from '../constants/dataTypes/inboundDb';
import * as supported from '../retrieve/unified/supported';
import { has } from '../lib/has';
export var load = function load(dataType) {
  if (supported.get(dataType)) {
    return import(
    /* webpackChunkName: "reporting-data__unified" */
    './unified/').then(function (_ref) {
      var modules = _ref.default;
      return modules[dataType];
    });
  } else if (has(inboundDbDataTypes, dataType)) {
    return import(
    /* webpackChunkName: "reporting-data__inboundDb" */
    './inboundDb/').then(function (_ref2) {
      var modules = _ref2.default;
      return modules[dataType];
    });
  }

  return import(
  /* webpackChunkName: "reporting-data__custom" */
  './legacy/').then(function (_ref3) {
    var modules = _ref3.default;
    return modules[dataType];
  });
};
export var setLoadForTesting = function setLoadForTesting(mockedFunction) {
  load = mockedFunction;
};