'use es6';

import { getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { AGENT, BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { isFromBot, isFromVisitor } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import { getResponderByIdAndType } from '../responders/operators/getResponderByIdAndType';
import { getResponders } from '../responders/selectors/getResponders';
import { receivedIncomingMessage } from './ChatActions/receivedIncomingMessage';
export function defaultMessageReceived(message, channel, threadId, publishContext) {
  return function (dispatch, getState) {
    var responders = getResponders(getState());
    var responder; // Chat open in multiple windows

    var messageFromVisitor = isFromVisitor(message);

    if (!messageFromVisitor) {
      var senderId = getSenderId(message);
      var senderType = isFromBot(message) ? BOT : AGENT;
      responder = getResponderByIdAndType({
        responders: responders,
        senderType: senderType,
        senderId: senderId
      });
    }

    dispatch(receivedIncomingMessage({
      message: message,
      channel: channel,
      responder: responder,
      shouldNotify: !messageFromVisitor && (!publishContext || !publishContext.playback),
      threadId: threadId
    }));
  };
}