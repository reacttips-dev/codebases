'use es6';

import { createSelector } from 'reselect';
import { getAllAgentResponders } from './getAllAgentResponders';
export var getAgentRespondersList = createSelector([getAllAgentResponders], function (agentRespondersMap) {
  return agentRespondersMap.toList();
});