'use es6';

import { getPubSubClient } from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import { getQuickReply } from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { isConversationalMessage } from 'conversations-message-history/common-message/operators/isConversationalMessage';
import { deserialize, serialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
import { isClosed } from '../../threads/operators/isClosed';
import { createAction } from 'flux-actions';
import Raven from 'Raven';
import { updateMessageInConversation } from '../../actions/ConversationsActions/updateMessageInConversation';
import { PUBLISH_MESSAGE } from '../../pubsub/constants/asyncActionTypes';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { getCurrentThreadHistoryFetchStatus } from '../../thread-history/selectors/getCurrentThreadHistoryFetchStatus';
import { STARTED } from 'conversations-async-data/async-data/constants/asyncStatuses';
export var publishMessageStarted = createAction(PUBLISH_MESSAGE.STARTED, function (_ref) {
  var channel = _ref.channel,
      message = _ref.message,
      messageKey = _ref.messageKey,
      threadId = _ref.threadId;
  return {
    channel: channel,
    message: message,
    messageKey: messageKey,
    threadId: threadId
  };
});
export var publishMessageSucceeded = createAction(PUBLISH_MESSAGE.SUCCEEDED, function (_ref2) {
  var channel = _ref2.channel,
      messageKey = _ref2.messageKey,
      publishedMessage = _ref2.publishedMessage,
      threadId = _ref2.threadId;
  return {
    channel: channel,
    messageKey: messageKey,
    publishedMessage: publishedMessage,
    threadId: threadId
  };
});
export var publishMessageFailed = createAction(PUBLISH_MESSAGE.FAILED, function (_ref3) {
  var channel = _ref3.channel,
      messageKey = _ref3.messageKey,
      message = _ref3.message,
      threadId = _ref3.threadId,
      error = _ref3.error;
  return {
    channel: channel,
    messageKey: messageKey,
    message: message,
    threadId: threadId,
    error: error
  };
});
export var publishMessage = function publishMessage(_ref4) {
  var channel = _ref4.channel,
      message = _ref4.message,
      threadId = _ref4.threadId;
  return function (dispatch, getState) {
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });

    if (getCurrentThreadHistoryFetchStatus(getState()) === STARTED) {
      dispatch(publishMessageFailed({
        channel: channel,
        messageKey: getId(message),
        message: message,
        threadId: threadId,
        error: 'message sent while threads fetching'
      }));
      return Promise.resolve();
    }

    if (isClosed(thread)) {
      return Promise.resolve();
    }

    dispatch(publishMessageStarted({
      channel: channel,
      message: message,
      messageKey: getId(message),
      threadId: threadId
    }));
    var client = getPubSubClient(getState());
    var publishData = {
      message: serialize(message),
      channel: channel
    };
    var promise = client.publish(publishData).then(function (_ref5) {
      var json = _ref5.data;
      var publishedMessage = deserialize({
        json: json
      });
      dispatch(publishMessageSucceeded({
        channel: channel,
        messageKey: getId(message),
        publishedMessage: publishedMessage,
        threadId: threadId
      }));
      dispatch(updateMessageInConversation({
        updated: publishedMessage,
        channel: channel,
        message: message,
        threadId: threadId
      }));
    }).catch(function (error) {
      dispatch(publishMessageFailed({
        channel: channel,
        messageKey: getId(message),
        message: message,
        threadId: threadId,
        error: error
      }));
    });

    try {
      var isQuickReplyResponse = Boolean(getQuickReply(message));

      if (isConversationalMessage(message) && !isQuickReplyResponse && isClosed(thread)) {
        Raven.captureMessage('VISITOR_MESSAGE_PUBLISHED_ON_CLOSED_THREAD', {
          extra: {
            threadId: threadId,
            publishData: publishData
          }
        });
      }
    } catch (e) {// error
    }

    promise.done();
    return promise;
  };
};