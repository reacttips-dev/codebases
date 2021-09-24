'use es6';

import { getBrowserPrefix } from './getBrowserPrefix';
import { getVisibilityChangeNamespace } from './getVisibilityChangeNamespace';
import { wrapVisibilityCallback } from './wrapVisibilityCallback';
export function addVisibilityChangeListener(callback) {
  var prefix = getBrowserPrefix();

  if (prefix) {
    var visibilityChange = getVisibilityChangeNamespace(prefix);
    document.addEventListener(visibilityChange, wrapVisibilityCallback(callback));
  } else {
    window.addEventListener('focus', wrapVisibilityCallback(callback));
    window.addEventListener('blur', wrapVisibilityCallback(callback));
  }
}