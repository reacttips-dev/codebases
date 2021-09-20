'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _createCompositeDecorator = require('./createCompositeDecorator');

var _createCompositeDecorator2 = _interopRequireDefault(_createCompositeDecorator);

var _MultiDecorator = require('./MultiDecorator');

var _MultiDecorator2 = _interopRequireDefault(_MultiDecorator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Return true if decorator implements the DraftDecoratorType interface
// @see https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js
var decoratorIsCustom = function decoratorIsCustom(decorator) {
  return typeof decorator.getDecorations === 'function' && typeof decorator.getComponentForKey === 'function' && typeof decorator.getPropsForKey === 'function';
};

var getDecoratorsFromProps = function getDecoratorsFromProps(_ref) {
  var decorators = _ref.decorators,
      plugins = _ref.plugins;
  return (0, _immutable.List)([{ decorators: decorators }].concat(_toConsumableArray(plugins))).filter(function (plugin) {
    return plugin.decorators !== undefined;
  }).flatMap(function (plugin) {
    return plugin.decorators;
  });
};

var resolveDecorators = function resolveDecorators(props, getEditorState, onChange) {
  var decorators = getDecoratorsFromProps(props);
  var compositeDecorator = (0, _createCompositeDecorator2.default)(decorators.filter(function (decorator) {
    return !decoratorIsCustom(decorator);
  }), getEditorState, onChange);

  var customDecorators = decorators.filter(function (decorator) {
    return decoratorIsCustom(decorator);
  });

  return new _MultiDecorator2.default(customDecorators.push(compositeDecorator));
};

exports.default = resolveDecorators;