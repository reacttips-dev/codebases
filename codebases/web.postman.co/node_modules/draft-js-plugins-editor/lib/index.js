'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeDecorators = exports.createEditorStateWithText = exports.default = undefined;

var _createEditorStateWithText = require('./utils/createEditorStateWithText');

var _createEditorStateWithText2 = _interopRequireDefault(_createEditorStateWithText);

var _composeDecorators = require('./utils/composeDecorators');

var _composeDecorators2 = _interopRequireDefault(_composeDecorators);

var _Editor = require('./Editor');

var _Editor2 = _interopRequireDefault(_Editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Editor2.default;

// eslint-disable-next-line import/no-named-as-default

var createEditorStateWithText = exports.createEditorStateWithText = _createEditorStateWithText2.default;
var composeDecorators = exports.composeDecorators = _composeDecorators2.default;