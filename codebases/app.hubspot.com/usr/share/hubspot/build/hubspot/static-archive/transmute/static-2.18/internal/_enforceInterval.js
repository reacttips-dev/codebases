"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = enforceInterval;

function enforceInterval(interval) {
  if (typeof interval === 'number' && interval >= 0) {
    return interval;
  }

  throw new Error("expected `interval` to be a positive number but got `" + interval + "`");
}

module.exports = exports.default;