'use es6';

import { getMessages } from './getMessages';
export var lastMessage = function lastMessage(threadHistory) {
  return getMessages(threadHistory).last();
};