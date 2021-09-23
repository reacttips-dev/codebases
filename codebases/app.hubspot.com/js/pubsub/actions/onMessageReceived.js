'use es6';

import { isCloseThreadMessage } from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
import { isOpenThreadMessage } from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
import { isContactAssociationMessage } from 'conversations-message-history/contact-association-message/operators/isContactAssociationMessage';
import { isTypingMessage } from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
import { isCrmObjectLifecycleUpdate } from 'conversations-message-history/crm-object-lifecycle-update/operators/isCrmObjectLifecycleUpdate';
import { isCommonMessageFormat } from 'conversations-message-history/common-message-format/operators/cmfComparators';
import { deserialize } from 'conversations-message-history/common-message/serializers/messageSerializer';
import { assignmentV2MessageReceived } from '../../actions/assignmentV2MessageReceived';
import { defaultMessageReceived } from '../../actions/defaultMessageReceived';
import { resolveAttachmentsForMessage } from '../../resolved-attachments/actions/resolveAttachmentsForMessage';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { dismissTypingIndicator } from '../../typing-indicators/actions/dismissTypingIndicator';
import { typingMessageReceived } from '../../typing-indicators/actions/typingMessageReceived';
import { closeThreadMessageReceived } from './closeThreadMessageReceived';
import { openThreadMessageReceived } from './openThreadMessageReceived';
import { channelChangeReceived } from './changeChannelReceived';
import { ChannelChange, CHANNEL_CHANGE } from 'conversations-internal-pub-sub/channel-change/records/ChannelChange';
import { getType } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { onContactAssociated } from './onContactAssociated';
import { validateMessageClientType } from '../util/validateMessageClientType';
import { isAssignmentUpdateMessage } from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
export var onMessageReceived = function onMessageReceived(_ref) {
  var threadId = _ref.threadId,
      pubSubMessage = _ref.message,
      channel = _ref.channel,
      _ref$publishContext = _ref.publishContext,
      publishContext = _ref$publishContext === void 0 ? {} : _ref$publishContext;
  return function (dispatch, getState) {
    var messageJson = pubSubMessage.data,
        clientId = pubSubMessage.clientId;
    var thread = getThreadByThreadId(getState(), {
      threadId: threadId
    });

    if (getType(messageJson) === CHANNEL_CHANGE) {
      dispatch(channelChangeReceived({
        channelChange: new ChannelChange(messageJson),
        threadId: threadId
      }));
      return;
    }

    var message = deserialize({
      json: messageJson
    });
    validateMessageClientType({
      message: message,
      clientId: clientId
    });

    switch (true) {
      case isCrmObjectLifecycleUpdate(message):
        {
          // NOOP
          break;
        }

      case isCommonMessageFormat(message):
        {
          dispatch(dismissTypingIndicator(message, threadId));
          dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
          dispatch(resolveAttachmentsForMessage({
            message: message,
            threadId: threadId
          }));
          break;
        }

      case isAssignmentUpdateMessage(message):
        {
          dispatch(assignmentV2MessageReceived(message, channel, threadId));
          break;
        }

      case isContactAssociationMessage(message):
        {
          onContactAssociated();
          break;
        }

      case isTypingMessage(message):
        {
          if (!publishContext.playback) dispatch(typingMessageReceived(message, threadId));
          break;
        }

      case isCloseThreadMessage(message):
        {
          dispatch(closeThreadMessageReceived({
            message: message,
            thread: thread,
            channel: channel
          }));
          break;
        }

      case isOpenThreadMessage(message):
        {
          dispatch(openThreadMessageReceived({
            message: message,
            channel: channel,
            threadId: threadId
          }));
          break;
        }

      default:
        {
          dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
        }
    }
  };
};