'use es6';

import { HUMAN as HUMAN_AGENT_TYPE, BOT as BOT_AGENT_TYPE } from 'conversations-message-history/common-message-format/constants/agentTypes';
import { BOT as BOT_SENDER_TYPE } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import { fetchAgentResponder } from '../responders/actions/fetchAgentResponder';
import { getResponderByIdAndType } from '../responders/operators/getResponderByIdAndType';
import { getResponders } from '../responders/selectors/getResponders';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getSessionId } from '../selectors/widgetDataSelectors/getSessionId';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getCurrentThreadId } from '../thread-history/selectors/getCurrentThreadId';

var senderTypeToAgentType = function senderTypeToAgentType(senderType) {
  return senderType === BOT_SENDER_TYPE ? BOT_AGENT_TYPE : HUMAN_AGENT_TYPE;
};

export var fetchAgentResponderIfNecessary = function fetchAgentResponderIfNecessary(_ref) {
  var senderId = _ref.senderId,
      senderType = _ref.senderType;
  return function (dispatch, getState) {
    var responders = getResponders(getState());
    var respondersObject = getResponderByIdAndType({
      responders: responders,
      senderId: senderId,
      senderType: senderType
    });
    var responder = getData(respondersObject);
    var responderId = getUserId(responder);
    var threadId = getCurrentThreadId(getState());

    if (!senderId || responderId || !threadId) {
      return;
    }

    var agentType = senderTypeToAgentType(senderType);
    dispatch(fetchAgentResponder({
      senderId: senderId,
      agentType: agentType,
      sessionId: getSessionId(getState()),
      threadId: getCurrentThreadId(getState())
    }));
  };
};