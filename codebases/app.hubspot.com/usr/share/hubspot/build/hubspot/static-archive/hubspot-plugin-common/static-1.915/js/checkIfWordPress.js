'use es6';

import { setWordPressGlobal } from './initWordPress';
var isWordPressCache;
export function clearIsWordPressCacheForTests() {
  isWordPressCache = undefined;
  window.hubspot.wordpress = undefined;
}
export default function checkIfWordPress() {
  if (typeof isWordPressCache === 'undefined') {
    isWordPressCache = setWordPressGlobal();
  }

  return isWordPressCache;
}