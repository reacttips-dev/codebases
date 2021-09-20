"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneElementWithClassName = cloneElementWithClassName;
exports.cloneChildrenWithClassName = cloneChildrenWithClassName;
exports.isMuiElement = isMuiElement;
exports.isMuiComponent = isMuiComponent;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

/* eslint-disable import/prefer-default-export */
function cloneElementWithClassName(child, className) {
  return _react.default.cloneElement(child, {
    className: (0, _classnames.default)(child.props.className, className)
  });
}

function cloneChildrenWithClassName(children, className) {
  return _react.default.Children.map(children, function (child) {
    return _react.default.isValidElement(child) && cloneElementWithClassName(child, className);
  });
}

function isMuiElement(element, muiNames) {
  return _react.default.isValidElement(element) && muiNames.indexOf(element.type.muiName) !== -1;
}

function isMuiComponent(element, muiNames) {
  return muiNames.indexOf(element.muiName) !== -1;
}