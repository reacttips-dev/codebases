"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCustomAttribute = exports.MEASURE_API_VERIFY_TIME = exports.MEASURE_USER_INFO_TIME = exports.MARK_USER_INFO_SUCCESS = exports.MARK_USER_INFO_START = void 0;

var newRelicAvailabile = function newRelicAvailabile() {
  return Boolean(window.newrelic);
};

var MARK_USER_INFO_START = 'mark_user_info_start';
exports.MARK_USER_INFO_START = MARK_USER_INFO_START;
var MARK_USER_INFO_SUCCESS = 'mark_user_info_success';
exports.MARK_USER_INFO_SUCCESS = MARK_USER_INFO_SUCCESS;
var MEASURE_USER_INFO_TIME = 'measure_user_info_time';
exports.MEASURE_USER_INFO_TIME = MEASURE_USER_INFO_TIME;
var MEASURE_API_VERIFY_TIME = 'measure_api_verify_time';
exports.MEASURE_API_VERIFY_TIME = MEASURE_API_VERIFY_TIME;

var setCustomAttribute = function setCustomAttribute(name, value) {
  if (newRelicAvailabile()) {
    window.newrelic.setCustomAttribute(name, value);
  }
};

exports.setCustomAttribute = setCustomAttribute;