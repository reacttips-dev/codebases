'use es6';

import getIn from 'transmute/getIn';
var KEY_PATHS = {
  AGENT_STATE: ['agentState']
};
export var getAgentState = getIn(KEY_PATHS.AGENT_STATE);