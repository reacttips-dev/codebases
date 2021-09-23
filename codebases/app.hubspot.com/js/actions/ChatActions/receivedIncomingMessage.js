'use es6';

import { createAction } from 'flux-actions';
import { isConversationalMessage } from 'conversations-message-history/common-message/operators/isConversationalMessage';
import { getSenderType, getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { VISITOR, AGENT, BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { hasNewUnseenMessage } from '../../last-seen/actions/hasNewUnseenMessage';
import { fetchAgentResponderIfNecessary } from '../../actions/AgentResponderActions';
import { isActiveOnThread } from '../../selectors/clientSelectors/isActiveOnThread';
import { getIsOpen } from '../../selectors/getIsOpen';
export var receivedIncomingMessageAction = createAction(ActionTypes.RECEIVED_INCOMING_MESSAGE, function (_ref) {
  var message = _ref.message,
      channel = _ref.channel,
      responder = _ref.responder,
      shouldNotify = _ref.shouldNotify,
      threadId = _ref.threadId;
  return {
    message: message,
    channel: channel,
    responder: responder,
    shouldNotify: shouldNotify,
    threadId: threadId
  };
});
export function receivedIncomingMessage(_ref2) {
  var message = _ref2.message,
      channel = _ref2.channel,
      responder = _ref2.responder,
      shouldNotify = _ref2.shouldNotify,
      threadId = _ref2.threadId;
  return function (dispatch, getState) {
    dispatch(receivedIncomingMessageAction({
      message: message,
      channel: channel,
      responder: responder,
      shouldNotify: shouldNotify,
      threadId: threadId
    }));
    var widgetClosed = !getIsOpen(getState());
    var notActiveOnThread = !isActiveOnThread(getState(), threadId);
    var senderType = getSenderType(message);
    var senderId = getSenderId(message);

    if (isConversationalMessage(message) && (widgetClosed || notActiveOnThread) && senderType !== VISITOR && shouldNotify) {
      dispatch(hasNewUnseenMessage({
        channel: channel,
        threadId: threadId
      }));
    }

    if (senderType === AGENT || senderType === BOT) {
      dispatch(fetchAgentResponderIfNecessary({
        senderId: senderId,
        senderType: senderType
      }));
    }
  };
}