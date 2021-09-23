'use es6';

import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
export var openThreadMessageReceived = function openThreadMessageReceived(_ref) {
  var message = _ref.message,
      channel = _ref.channel,
      threadId = _ref.threadId;
  return function (dispatch) {
    dispatch(defaultMessageReceived(message, channel, threadId));
  };
};