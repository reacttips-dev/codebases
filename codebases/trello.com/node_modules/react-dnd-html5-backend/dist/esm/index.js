import { HTML5BackendImpl } from './HTML5BackendImpl';
import * as NativeTypes from './NativeTypes';
export { getEmptyImage } from './getEmptyImage';
export { NativeTypes };
export var HTML5Backend = function createBackend(manager, context, options) {
  return new HTML5BackendImpl(manager, context, options);
};