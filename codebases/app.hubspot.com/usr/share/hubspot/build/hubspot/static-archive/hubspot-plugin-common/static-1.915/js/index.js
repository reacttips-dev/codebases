'use es6';

import initWordPress from './initWordPress';
import checkIfWordPress from './checkIfWordPress';
import getLeadinConfig from './getLeadinConfig';
import buildWordpressUrl from './buildWordpressUrl';
var isWordPress = checkIfWordPress();

var isWordPressAdmin = function isWordPressAdmin() {
  return getLeadinConfig().admin;
};

export { initWordPress, isWordPress, isWordPressAdmin, buildWordpressUrl };