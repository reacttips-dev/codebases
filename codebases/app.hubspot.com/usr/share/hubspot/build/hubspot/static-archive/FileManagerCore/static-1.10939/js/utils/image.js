'use es6';

import Immutable from 'immutable';
import { getIsImage, getIsSvg } from './file';
import { getIsFilePrivate } from './fileAccessibility';
var EDITABLE_EXTENSIONS = Immutable.Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
export var hasDimensions = function hasDimensions(file) {
  return file.get('width') && file.get('height');
};
export var shouldRecalculateDimensions = function shouldRecalculateDimensions(file) {
  return getIsImage(file) && !getIsSvg(file) && !hasDimensions(file);
};
export function scaleToFit(file, size) {
  if (!hasDimensions(file)) {
    return {
      width: size,
      height: null
    };
  }

  var width = file.get('width');
  var height = file.get('height');
  var scale = Math.min(1, size / Math.max(width, height));
  return {
    width: Math.min(size, Math.floor(width * scale)),
    height: Math.min(size, Math.floor(height * scale))
  };
}
export function isShutterstock(file) {
  return file.hasIn(['meta', 'shutterstock_id']);
}
export function isEditableImage(file) {
  return EDITABLE_EXTENSIONS.includes(file.get('extension')) && !isShutterstock(file) && !getIsFilePrivate(file);
}