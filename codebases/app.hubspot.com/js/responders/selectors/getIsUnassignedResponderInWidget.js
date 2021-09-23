'use es6';

import { createSelector } from 'reselect';
import { getAssignedResponderInWidget } from './getAssignedResponderInWidget';
import { getIsBot } from 'conversations-internal-schema/responders/operators/responderGetters';
export var getIsUnassignedResponderInWidget = createSelector([getAssignedResponderInWidget], function (assignedResponder) {
  return !assignedResponder || getIsBot(assignedResponder);
});