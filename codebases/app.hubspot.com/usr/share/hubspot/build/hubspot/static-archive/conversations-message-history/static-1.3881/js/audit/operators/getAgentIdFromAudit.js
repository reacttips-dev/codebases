'use es6';

import { BOT_HANDOFF, MANUAL, VISITOR } from '../constants/auditTypes';
import { getType } from './auditGetters';
import { getBotId } from './botHandoffAuditGetters';
import { getAgentId } from './manualAuditGetters';
import { getVisitorId } from './visitorAuditGetters';
export var getAgentIdFromAudit = function getAgentIdFromAudit(audit) {
  if (!audit) return null;

  switch (getType(audit)) {
    case BOT_HANDOFF:
      return getBotId(audit);

    case MANUAL:
      return getAgentId(audit);

    case VISITOR:
      return getVisitorId(audit);

    default:
      return null;
  }
};