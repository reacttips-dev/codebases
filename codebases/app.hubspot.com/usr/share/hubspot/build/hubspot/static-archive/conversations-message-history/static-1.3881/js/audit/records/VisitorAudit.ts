import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { VISITOR } from '../constants/auditTypes';
var VisitorAudit = Record((_Record = {}, _defineProperty(_Record, AUDIT_TYPE, VISITOR), _defineProperty(_Record, "vid", null), _Record), 'VisitorAudit');
export default VisitorAudit;