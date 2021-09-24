'use es6';

import { createAction } from 'flux-actions';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { postUnreadConversationCountChangedEvent } from '../../threads/actions/postUnreadConversationCountChangedEvent';
import { getUnseenCount } from '../../threads/operators/threadGetters';
export var incrementUnseenCountAction = createAction(ActionTypes.INCREMENT_UNSEEN_COUNT, function (_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return {
    channel: channel,
    threadId: threadId
  };
});
export var incrementUnseenCount = function incrementUnseenCount(_ref2) {
  var channel = _ref2.channel,
      threadId = _ref2.threadId;
  return function (dispatch, getState) {
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });
    var originalUnseenCountForThread = getUnseenCount(thread);
    dispatch(incrementUnseenCountAction({
      channel: channel,
      threadId: threadId
    }));

    if (originalUnseenCountForThread === 0) {
      var newUnreadThreadsCount = calculateUnseenThreadsCount(getState());
      postUnreadConversationCountChangedEvent({
        unreadCount: newUnreadThreadsCount
      });
    }
  };
};