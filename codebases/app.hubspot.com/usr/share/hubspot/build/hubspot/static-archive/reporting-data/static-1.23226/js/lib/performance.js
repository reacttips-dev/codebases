'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import { Map as ImmutableMap } from 'immutable';
var startKey = 'reportingDataPerf_start';
var endKey = 'reportingDataPerf_end';

var mark = function mark(marks, key) {
  if (marks.has(key)) {
    var previousValue = marks.get(key);
    console.warn('ReportingPerf', key + " was already marked with `" + previousValue + "`!");
  }

  return marks.set(key, window.performance.now());
};

export var ReportingPerf = function ReportingPerf() {
  var _this = this;

  _classCallCheck(this, ReportingPerf);

  this.markStart = function () {
    _this.marks = mark(_this.marks, startKey);
  };

  this.markEnd = function () {
    _this.marks = mark(_this.marks, endKey);
    return _this.measure();
  };

  this.measure = function () {
    var maybeStartTime = _this.marks.get(startKey);

    var maybeEndTime = _this.marks.get(endKey);

    if (maybeStartTime == null || maybeEndTime == null) {
      return NaN;
    }

    return maybeEndTime - maybeStartTime;
  };

  this.getMarks = function () {
    return _this.marks;
  };

  this.marks = ImmutableMap();
};