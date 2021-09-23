'use es6';

import { getBrowserPrefix } from './getBrowserPrefix';
import { getHiddenNamespace } from './getHiddenNamespace';
export function isHidden() {
  var prefix = getBrowserPrefix();

  if (prefix) {
    var hidden = getHiddenNamespace(prefix);
    return document[hidden];
  }

  if (typeof document.hasFocus === 'function') {
    return !document.hasFocus();
  }

  return false;
}