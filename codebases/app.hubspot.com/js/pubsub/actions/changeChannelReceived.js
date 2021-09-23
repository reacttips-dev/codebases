'use es6';

import { createAction } from 'flux-actions';
import { CHANNEL_CHANGE_RECEIVED } from '../constants/pubsubActionTypes';
export var channelChangeReceived = createAction(CHANNEL_CHANGE_RECEIVED, function (_ref) {
  var channelChange = _ref.channelChange,
      threadId = _ref.threadId;
  return {
    channelChange: channelChange,
    threadId: threadId
  };
});