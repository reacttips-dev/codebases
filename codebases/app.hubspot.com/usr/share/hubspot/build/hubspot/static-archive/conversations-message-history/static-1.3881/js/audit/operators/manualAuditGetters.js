'use es6';

import get from 'transmute/get';
import { AGENT_ID, AGENT_TYPE, BOT_ID } from '../constants/keyPaths';
export var getAgentId = get(AGENT_ID);
export var getAgentType = get(AGENT_TYPE);
export var getBotId = get(BOT_ID);