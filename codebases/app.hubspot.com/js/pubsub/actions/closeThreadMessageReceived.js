'use es6';

import { getThreadId } from '../../threads/operators/threadGetters';
import { postConversationClosedEvent } from '../../threads/actions/postConversationClosedEvent';
import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
export var closeThreadMessageReceived = function closeThreadMessageReceived(_ref) {
  var message = _ref.message,
      channel = _ref.channel,
      thread = _ref.thread;
  return function (dispatch) {
    var threadId = getThreadId(thread);
    postConversationClosedEvent({
      thread: thread
    });
    dispatch(defaultMessageReceived(message, channel, threadId));
  };
};