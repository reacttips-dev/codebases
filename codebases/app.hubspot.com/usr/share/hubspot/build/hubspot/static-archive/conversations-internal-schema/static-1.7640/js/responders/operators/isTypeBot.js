'use es6';

import { BOT } from '../constants/agentTypes';
import { getAgentType } from './getAgentType';
export var isTypeBot = function isTypeBot(responder) {
  return getAgentType(responder) === BOT;
};