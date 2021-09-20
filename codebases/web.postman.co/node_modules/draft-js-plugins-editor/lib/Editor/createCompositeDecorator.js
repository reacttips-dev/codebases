'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Creates a composite decorator based on the provided plugins
                                                                                                                                                                                                                                                                   */

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var _decorateComponentWithProps = require('decorate-component-with-props');

var _decorateComponentWithProps2 = _interopRequireDefault(_decorateComponentWithProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (decorators, getEditorState, setEditorState) {
  var convertedDecorators = (0, _immutable.List)(decorators).map(function (decorator) {
    return _extends({}, decorator, {
      component: (0, _decorateComponentWithProps2.default)(decorator.component, { getEditorState: getEditorState, setEditorState: setEditorState })
    });
  }).toJS();

  return new _draftJs.CompositeDecorator(convertedDecorators);
};