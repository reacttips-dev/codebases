import { AUDIT_TYPE } from '../constants/keyPaths';
import { BOT_HANDOFF, MANUAL, MULTIPLE, SYSTEM_MIGRATION, SYSTEM_TEST, UNKNOWN, VISITOR } from '../constants/auditTypes';
import BotHandoffAudit from '../records/BotHandoffAudit';
import ManualAudit from '../records/ManualAudit';
import MultipleAudit from '../records/MultipleAudit';
import SystemMigrationAudit from '../records/SystemMigrationAudit';
import SystemTestAudit from '../records/SystemTestAudit';
import VisitorAudit from '../records/VisitorAudit';
import UnknownAudit from '../records/UnknownAudit';
export var buildAudit = function buildAudit() {
  var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var type = attributes[AUDIT_TYPE];

  switch (type) {
    case BOT_HANDOFF:
      return BotHandoffAudit(attributes);

    case MANUAL:
      return ManualAudit(attributes);

    case MULTIPLE:
      return MultipleAudit(attributes);

    case SYSTEM_MIGRATION:
      return SystemMigrationAudit(attributes);

    case SYSTEM_TEST:
      return SystemTestAudit(attributes);

    case VISITOR:
      return VisitorAudit(attributes);

    case UNKNOWN:
    default:
      return UnknownAudit(attributes);
  }
};