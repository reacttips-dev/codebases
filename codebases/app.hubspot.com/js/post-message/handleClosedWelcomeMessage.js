'use es6';

import { CLOSED_WELCOME_MESSAGE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export var handleClosedWelcomeMessage = function handleClosedWelcomeMessage(data) {
  return postMessageToParent(CLOSED_WELCOME_MESSAGE, data);
};