'use es6';

import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { stageMessageOnStubbedThread } from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import { addAvailabilityMessage } from '../../availability/actions/addAvailabilityMessage';
import { publishMessage } from '../../pubsub/actions/publishMessage';
export function publishMessageToConversation(_ref) {
  var channel = _ref.channel,
      message = _ref.message,
      threadId = _ref.threadId;
  return function (dispatch) {
    if (threadId === STUBBED_THREAD_ID) {
      dispatch(stageMessageOnStubbedThread(message));
    } else {
      dispatch(publishMessage({
        channel: channel,
        message: message,
        threadId: threadId
      })).then(function () {
        return dispatch(addAvailabilityMessage({
          channel: channel,
          threadId: threadId
        }));
      }).done();
    }
  };
}