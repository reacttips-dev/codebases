'use es6';

import { List } from 'immutable';
import { getUserId } from 'conversations-internal-schema/responders/operators/responderGetters';
import { getAssignedAgentId, getResponder } from './threadGetters';
export var findAssignedResponder = function findAssignedResponder(_ref) {
  var thread = _ref.thread,
      _ref$responders = _ref.responders,
      responders = _ref$responders === void 0 ? List() : _ref$responders,
      botResponder = _ref.botResponder;

  if (!thread && !botResponder) {
    return null;
  }

  var initialAssignedResponder = getResponder(thread);
  var assignedAgent = (responders || List()).find(function (responder) {
    return "" + getUserId(responder) === "" + getAssignedAgentId(thread);
  });
  return assignedAgent || botResponder || initialAssignedResponder || null;
};