'use es6';

import { isAgentState } from './isAgentState';
import { AVAILABLE } from '../constants/AgentStates';
export var isAvailable = isAgentState(AVAILABLE);