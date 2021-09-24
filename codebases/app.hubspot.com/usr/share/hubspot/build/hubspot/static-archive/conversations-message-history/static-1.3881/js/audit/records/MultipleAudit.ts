import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { MULTIPLE } from '../constants/auditTypes';
var MultipleAudit = Record(_defineProperty({}, AUDIT_TYPE, MULTIPLE), 'MultipleAudit');
export default MultipleAudit;