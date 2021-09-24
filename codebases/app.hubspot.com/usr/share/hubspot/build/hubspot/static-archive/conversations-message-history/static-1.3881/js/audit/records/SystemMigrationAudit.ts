import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Record } from 'immutable';
import { AUDIT_TYPE } from '../constants/keyPaths';
import { SYSTEM_MIGRATION } from '../constants/auditTypes';
var SystemMigrationAudit = Record(_defineProperty({}, AUDIT_TYPE, SYSTEM_MIGRATION), 'SystemMigrationAudit');
export default SystemMigrationAudit;