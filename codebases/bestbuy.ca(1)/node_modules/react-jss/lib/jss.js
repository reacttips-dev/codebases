'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGenerateClassNameDefault = exports.SheetsManager = exports.getDynamicStyles = exports.SheetsRegistry = undefined;

var _jss = require('jss');

Object.defineProperty(exports, 'SheetsRegistry', {
  enumerable: true,
  get: function get() {
    return _jss.SheetsRegistry;
  }
});
Object.defineProperty(exports, 'getDynamicStyles', {
  enumerable: true,
  get: function get() {
    return _jss.getDynamicStyles;
  }
});
Object.defineProperty(exports, 'SheetsManager', {
  enumerable: true,
  get: function get() {
    return _jss.SheetsManager;
  }
});
Object.defineProperty(exports, 'createGenerateClassNameDefault', {
  enumerable: true,
  get: function get() {
    return _jss.createGenerateClassName;
  }
});

var _jssPresetDefault = require('jss-preset-default');

var _jssPresetDefault2 = _interopRequireDefault(_jssPresetDefault);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = (0, _jss.create)((0, _jssPresetDefault2['default'])());