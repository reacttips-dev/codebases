'use es6';

import { REQUEST_WIDGET } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export var handleRequestWidget = function handleRequestWidget(data) {
  return postMessageToParent(REQUEST_WIDGET, data);
};