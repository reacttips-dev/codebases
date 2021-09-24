'use es6';

import { IFRAME_RESIZE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export var handleIframeResize = function handleIframeResize(data) {
  return postMessageToParent(IFRAME_RESIZE, data);
};