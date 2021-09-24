'use es6';

import curry from 'transmute/curry';
import { getAgentState } from './agentStateGetters';
export var isAgentState = curry(function (agentState, agentRecord) {
  return getAgentState(agentRecord) === agentState;
});