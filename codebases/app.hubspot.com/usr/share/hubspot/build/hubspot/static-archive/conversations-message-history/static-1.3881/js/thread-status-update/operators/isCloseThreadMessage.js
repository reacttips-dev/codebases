'use es6';

import { isThreadStatusUpdateMessage } from './isThreadStatusUpdateMessage';
import { hasThreadBeenClosed } from './hasThreadBeenClosed';
export var isCloseThreadMessage = function isCloseThreadMessage(message) {
  return isThreadStatusUpdateMessage(message) && hasThreadBeenClosed(message);
};