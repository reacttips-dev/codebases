"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function toggleable(fn) {
  var enabled = true;

  var isEnabled = function isEnabled() {
    return enabled;
  };

  var setEnabled = function setEnabled(state) {
    enabled = state;
  };

  var toggleableFn = function toggleableFn() {
    return fn(isEnabled).apply(void 0, arguments);
  };

  return Object.assign(toggleableFn, {
    setEnabled: setEnabled
  });
}

var _default = toggleable;
exports.default = _default;
module.exports = exports.default;