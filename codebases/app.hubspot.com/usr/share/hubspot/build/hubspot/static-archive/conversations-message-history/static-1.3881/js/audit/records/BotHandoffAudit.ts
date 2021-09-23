import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { BOT_HANDOFF } from '../constants/auditTypes';
var BotHandoffAudit = Record((_Record = {}, _defineProperty(_Record, AUDIT_TYPE, BOT_HANDOFF), _defineProperty(_Record, "botId", null), _Record), 'BotHandoffAudit');
export default BotHandoffAudit;