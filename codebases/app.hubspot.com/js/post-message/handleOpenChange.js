'use es6';

import { OPEN_CHANGE } from '../constants/PostMessageTypes';
import { postMessageToParent } from './postMessageToParent';
export var handleOpenChange = function handleOpenChange(isOpen, isUser) {
  return postMessageToParent(OPEN_CHANGE, {
    isOpen: isOpen,
    isUser: isUser
  });
};