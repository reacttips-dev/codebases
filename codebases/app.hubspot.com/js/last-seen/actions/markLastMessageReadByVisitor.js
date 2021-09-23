'use es6';

import { createAction } from 'flux-actions';
import { getThreadId, getLatestReadTimestamp, getLatestMessageTimestamp, getPreviewMessageId, getChannelName } from '../../threads/operators/threadGetters';
import { silenceErrorAlert } from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { VISITOR } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { markMessageReadByVisitor } from '../../threads/clients/markMessageReadByVisitor';
import { getSessionId } from '../../selectors/widgetDataSelectors/getSessionId';
import { postClearPageTitleNotification } from '../../page-title-notifications/actions/post-message/postClearPageTitleNotification';
export var lastSeenSent = createAction(ActionTypes.LAST_SEEN_SENT, function (_ref) {
  var role = _ref.role,
      threadId = _ref.threadId,
      channel = _ref.channel,
      latestMessageTimestamp = _ref.latestMessageTimestamp;
  return {
    role: role,
    threadId: threadId,
    channel: channel,
    latestMessageTimestamp: latestMessageTimestamp
  };
});
export var lastSeenSuccess = createAction(ActionTypes.LAST_SEEN_SUCCESS, function (_ref2) {
  var role = _ref2.role,
      threadId = _ref2.threadId,
      channel = _ref2.channel,
      latestMessageTimestamp = _ref2.latestMessageTimestamp;
  return {
    role: role,
    threadId: threadId,
    channel: channel,
    latestMessageTimestamp: latestMessageTimestamp
  };
});
export var lastSeenFailure = createAction(ActionTypes.LAST_SEEN_FAILURE, function (_ref3) {
  var error = _ref3.error;
  return {
    error: error
  };
}, silenceErrorAlert);
export function markLastMessageReadByVisitor(_ref4) {
  var conversation = _ref4.conversation;
  return function (dispatch, getState) {
    var threadId = getThreadId(conversation);
    var sessionId = getSessionId(getState());
    var latestSentReadTimestamp = getLatestReadTimestamp(conversation);
    var latestMessageTimestamp = getLatestMessageTimestamp(conversation);
    var previewMessageId = getPreviewMessageId(conversation);

    if (latestMessageTimestamp && threadId && sessionId) {
      if (latestMessageTimestamp > latestSentReadTimestamp) {
        var channel = getChannelName(conversation);
        var payload = {
          role: VISITOR,
          threadId: threadId,
          channel: channel,
          latestMessageTimestamp: latestMessageTimestamp
        };
        dispatch(lastSeenSent(payload));
        markMessageReadByVisitor({
          messageId: previewMessageId,
          threadId: threadId,
          sessionId: sessionId
        }).then(function () {
          dispatch(lastSeenSuccess(payload));
          postClearPageTitleNotification();
        }).catch(function (error) {
          dispatch(lastSeenFailure({
            error: error
          }));
        }).done();
      }
    }
  };
}