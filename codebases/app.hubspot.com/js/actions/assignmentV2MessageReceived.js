'use es6';

import { getAssignedAgentId, getAssignedAgentType } from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
import { findResponderByIdFromList } from 'conversations-internal-schema/responders/operators/findResponderByIdFromList';
import { fetchAgentResponder } from '../responders/actions/fetchAgentResponder';
import { getAllAgentResponders } from '../responders/selectors/getAllAgentResponders';
import { getSessionId } from '../selectors/widgetDataSelectors/getSessionId';
import { defaultMessageReceived } from './defaultMessageReceived';
export function assignmentV2MessageReceived(message, channel, threadId) {
  return function (dispatch, getState) {
    var assignedAgentId = getAssignedAgentId(message);
    var responders = getAllAgentResponders(getState());
    var newlyAssignedResponder = findResponderByIdFromList({
      responders: responders,
      responderId: assignedAgentId
    });
    var shouldFetchResponder = assignedAgentId && !newlyAssignedResponder && threadId;

    if (shouldFetchResponder) {
      dispatch(fetchAgentResponder({
        senderId: assignedAgentId,
        agentType: getAssignedAgentType(message),
        sessionId: getSessionId(getState()),
        threadId: threadId
      }));
    }

    dispatch(defaultMessageReceived(message, channel, threadId));
  };
}