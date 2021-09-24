import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { MANUAL } from '../constants/auditTypes';
var ManualAudit = Record((_Record = {}, _defineProperty(_Record, AUDIT_TYPE, MANUAL), _defineProperty(_Record, "agentId", null), _defineProperty(_Record, "agentType", null), _Record), 'ManualAudit');
export default ManualAudit;