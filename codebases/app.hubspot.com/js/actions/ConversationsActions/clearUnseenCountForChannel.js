'use es6';

import { createAction } from 'flux-actions';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { postUnreadConversationCountChangedEvent } from '../../threads/actions/postUnreadConversationCountChangedEvent';
import { getUnseenCount } from '../../threads/operators/threadGetters';
var clearUnseenCountForChannelAction = createAction(ActionTypes.CLEAR_UNSEEN_COUNT_FOR_CHANNEL, function (_ref) {
  var channel = _ref.channel,
      threadId = _ref.threadId;
  return {
    channel: channel,
    threadId: threadId
  };
});
export var clearUnseenCountForChannel = function clearUnseenCountForChannel(_ref2) {
  var channel = _ref2.channel,
      threadId = _ref2.threadId;
  return function (dispatch, getState) {
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });
    var unseenCountForThread = getUnseenCount(thread);

    if (unseenCountForThread > 0) {
      dispatch(clearUnseenCountForChannelAction({
        channel: channel,
        threadId: threadId
      }));
      var newUnreadThreadsCount = calculateUnseenThreadsCount(getState());
      postUnreadConversationCountChangedEvent({
        unreadCount: newUnreadThreadsCount
      });
    }
  };
};