'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var onProcessRule = function onProcessRule(rule) {
  if (typeof rule.style === 'string') {
    rule.style = (0, _parse2['default'])(rule.style);
  }
};

exports['default'] = function () {
  return { onProcessRule: onProcessRule };
};