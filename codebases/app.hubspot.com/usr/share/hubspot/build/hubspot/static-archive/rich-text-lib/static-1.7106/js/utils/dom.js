'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { curry } from './iterables';
export var restoreFocusAfter = function restoreFocusAfter(callback) {
  var activeElement = document.activeElement;
  callback();

  if (activeElement) {
    activeElement.focus();
  }
};
export var serializeStyles = function serializeStyles(styleMap) {
  if (typeof styleMap === 'string') return styleMap;
  if (typeof styleMap !== 'object') return '';
  var styles = '';
  Object.keys(styleMap).forEach(function (style) {
    styles += style + ": " + styleMap[style] + "; ";
  });
  return styles.trim();
};
export var parseStyles = function parseStyles(styles) {
  if (typeof styles === 'object') return styles;
  if (typeof styles !== 'string') return '';
  var stylesMap = {};
  styles.split(';').forEach(function (style) {
    var _style$split = style.split(':'),
        _style$split2 = _slicedToArray(_style$split, 2),
        key = _style$split2[0],
        value = _style$split2[1];

    if (key && value) stylesMap[key.trim()] = value.trim();
  });
  return stylesMap;
};
export var styleTransformers = {
  'font-size': function fontSize(originalValue) {
    var value = parseInt(originalValue, 10);

    if (isNaN(value)) {
      return originalValue;
    }

    return value + "px";
  }
};
export var transformStyles = function transformStyles(stylesMap, transformers) {
  return Object.keys(stylesMap).reduce(function (acc, styleName) {
    if (Object.prototype.hasOwnProperty.call(transformers, styleName)) {
      acc[styleName] = transformers[styleName](stylesMap[styleName]);
    }

    return acc;
  }, stylesMap);
}; // NodeList.forEach is not supported in IE11

export var forEachNode = curry(function (callback, nodes) {
  Array.prototype.forEach.call(nodes, callback);
});