import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { UNKNOWN } from '../constants/auditTypes';
var UnknownAudit = Record(_defineProperty({}, AUDIT_TYPE, UNKNOWN), 'UnknownAudit');
export default UnknownAudit;