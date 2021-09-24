'use es6';

import { agentTypeToSenderType } from 'conversations-message-history/senders/operators/agentTypeToSenderType';
import { AGENT, BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { getAgentType, getIsBot, getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { Map as ImmutableMap } from 'immutable';
import invariant from 'react-utils/invariant';
export var buildResponderKey = function buildResponderKey(_ref) {
  var senderId = _ref.senderId,
      senderType = _ref.senderType;
  invariant(senderId && senderType, 'Responder keys must be set with valid ID and type. Received %s, %s', senderId, senderType);
  return ImmutableMap({
    senderId: String(senderId),
    senderType: senderType
  });
};
export var buildResponderKeyFromResponder = function buildResponderKeyFromResponder(responder) {
  var senderId = getUserId(responder);
  var agentType = getAgentType(responder);
  var senderType = agentType ? agentTypeToSenderType(agentType) : getIsBot(responder) ? BOT : AGENT;
  return buildResponderKey({
    senderId: senderId,
    senderType: senderType
  });
};
export var buildResponderKeyFromRequest = function buildResponderKeyFromRequest(requestArgs) {
  var senderId = requestArgs.senderId,
      agentType = requestArgs.agentType;
  var senderType = agentTypeToSenderType(agentType);
  return buildResponderKey({
    senderId: senderId,
    senderType: senderType
  });
};