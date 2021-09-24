'use es6';

import { createAction } from 'flux-actions';
import { TOGGLE_INITIAL_MESSAGE_BUBBLE } from '../constants/initialMessageBubbleActionTypes';
export var toggleInitialMessageBubble = createAction(TOGGLE_INITIAL_MESSAGE_BUBBLE, function (visible) {
  var closedByUser = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return {
    visible: visible,
    closedByUser: closedByUser
  };
});