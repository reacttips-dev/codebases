'use es6';

import { BOT_HANDOFF, MANUAL } from '../constants/auditTypes';
import { BOT, HUMAN } from '../../common-message-format/constants/agentTypes';
import { getType, getAgentType } from './auditGetters';
export var getAgentTypeFromAudit = function getAgentTypeFromAudit(audit) {
  if (!audit) return null;

  switch (getType(audit)) {
    case BOT_HANDOFF:
      return BOT;

    case MANUAL:
      if (getAgentType(audit) === BOT) {
        return BOT;
      }

      return HUMAN;

    default:
      return null;
  }
};