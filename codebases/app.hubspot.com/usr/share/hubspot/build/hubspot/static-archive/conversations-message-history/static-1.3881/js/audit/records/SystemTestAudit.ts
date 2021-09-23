import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { SYSTEM_TEST } from '../constants/auditTypes';
var SystemTestAudit = Record(_defineProperty({}, AUDIT_TYPE, SYSTEM_TEST), 'SystemTestAudit');
export default SystemTestAudit;