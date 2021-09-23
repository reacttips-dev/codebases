'use es6';

import { hasChatMessageFromAgent } from 'conversations-message-history/thread-history/operators/hasChatMessageFromAgent';
import { getTypicalResponseTime } from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import { publishTypicalResponseTimeMessage } from '../../typical-response-time/actions/publishTypicalResponseTimeMessage';
import { getWidgetAvailabilityOptions } from '../selectors/getWidgetAvailabilityOptions';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { historyDataForThread } from '../../thread-histories/selectors/historyDataForThread';
import { canSendNewTypicalResponseTimeMessage } from '../../thread-histories/operators/canSendNewTypicalResponseTimeMessage';
import { getThreadId } from '../../threads/operators/threadGetters';

function publish(_ref) {
  var channel = _ref.channel,
      thread = _ref.thread,
      state = _ref.state,
      dispatch = _ref.dispatch;
  var availabilityOptions = getWidgetAvailabilityOptions(state);
  var typicalResponseTime = getTypicalResponseTime(availabilityOptions);
  var shouldPublishTypicalResponseTimeMessage = !!typicalResponseTime;
  var threadId = getThreadId(thread);
  var threadHistory = historyDataForThread(state, {
    thread: thread
  });

  if (shouldPublishTypicalResponseTimeMessage) {
    if (canSendNewTypicalResponseTimeMessage(threadHistory)) {
      dispatch(publishTypicalResponseTimeMessage({
        channel: channel,
        threadId: threadId
      }));
    }
  }
}

export var publishAvailabilityMessage = function publishAvailabilityMessage(_ref2) {
  var channel = _ref2.channel,
      threadId = _ref2.threadId;
  return function (dispatch, getState) {
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });
    var threadHistory = historyDataForThread(getState(), {
      thread: thread
    });

    if (threadHistory && hasChatMessageFromAgent(threadHistory)) {
      return;
    }

    publish({
      channel: channel,
      thread: thread,
      state: getState(),
      dispatch: dispatch
    });
  };
};