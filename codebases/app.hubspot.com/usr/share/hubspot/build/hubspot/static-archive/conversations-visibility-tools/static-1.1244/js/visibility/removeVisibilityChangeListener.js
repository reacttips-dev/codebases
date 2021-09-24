'use es6';

import { getBrowserPrefix } from './getBrowserPrefix';
import { getVisibilityChangeNamespace } from './getVisibilityChangeNamespace';
import { wrapVisibilityCallback } from './wrapVisibilityCallback';
export function removeVisibilityChangeListener(callback) {
  var prefix = getBrowserPrefix();

  if (prefix) {
    var visibilityChange = getVisibilityChangeNamespace(prefix);
    document.removeEventListener(visibilityChange, wrapVisibilityCallback(callback));
  } else {
    window.removeEventListener('focus', wrapVisibilityCallback(callback));
    window.removeEventListener('blur', wrapVisibilityCallback(callback));
  }
}