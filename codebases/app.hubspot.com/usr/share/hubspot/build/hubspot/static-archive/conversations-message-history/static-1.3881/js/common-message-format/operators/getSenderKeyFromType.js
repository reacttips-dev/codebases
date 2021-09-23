'use es6';

import { VISITOR_SENDER, BOT_SENDER, AGENT_SENDER, SYSTEM_SENDER, VID_SENDER, INTEGRATOR_SENDER } from '../constants/cmfSenderTypes';
import { VID, UTK, ID } from '../constants/senderIdKeys';
export var getSenderKeyFromType = function getSenderKeyFromType(type) {
  switch (type) {
    case VID_SENDER:
      return VID;

    case VISITOR_SENDER:
      return UTK;

    case BOT_SENDER:
      return ID;

    case AGENT_SENDER:
      return ID;

    case INTEGRATOR_SENDER:
      return ID;

    case SYSTEM_SENDER:
    default:
      return null;
  }
};