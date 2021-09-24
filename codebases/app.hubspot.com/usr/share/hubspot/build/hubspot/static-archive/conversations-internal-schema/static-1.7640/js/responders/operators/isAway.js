'use es6';

import { isAgentState } from './isAgentState';
import { AWAY } from '../constants/AgentStates';
export var isAway = isAgentState(AWAY);