'use es6';

import setIn from 'transmute/setIn';
import { ASSIGNED_AGENT_ID } from '../../threads/constants/KeyPaths';
import curry from 'transmute/curry';
import { getAssignedAgentId } from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
export var setAssignedAgentId = setIn(ASSIGNED_AGENT_ID);
export var setAssignedAgentFromAssignmentMessage = curry(function (assignmentMessage, thread) {
  var agentId = getAssignedAgentId(assignmentMessage);
  return setAssignedAgentId(agentId, thread);
});