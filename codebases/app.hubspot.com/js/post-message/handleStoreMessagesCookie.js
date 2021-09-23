'use es6';

import { STORE_MESSAGES_COOKIE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export var handleStoreMessagesCookie = function handleStoreMessagesCookie(data) {
  return postMessageToParent(STORE_MESSAGES_COOKIE, data);
};