'use es6';

import getIn from 'transmute/getIn';
import { ASSSIGNED_AGENT_ID, ASSSIGNED_AGENT_TYPE, AUDIT_PARAMS, ASSIGNED_AGENT } from '../constants/keyPaths';
import { getAgentIdFromAudit as getAuditAgentId } from '../../audit/operators/getAgentIdFromAudit';
import { getAgentTypeFromAudit as getAuditAgentType } from '../../audit/operators/getAgentTypeFromAudit'; // shoud replace getAssignedAgentId and getAssigneeIdForAssignmentMessage

export var getAssignedAgentId = getIn(ASSSIGNED_AGENT_ID); // should replace getAssignedAgentType

export var getAssignedAgentType = getIn(ASSSIGNED_AGENT_TYPE);
export var getAudit = getIn(AUDIT_PARAMS); // should replace getAgentId

export var getAgentIdFromAudit = function getAgentIdFromAudit(message) {
  var audit = getAudit(message);
  return getAuditAgentId(audit);
}; // should replace getAgentType

export var getAgentTypeFromAudit = function getAgentTypeFromAudit(message) {
  var audit = getAudit(message);
  var agentType = getAuditAgentType(audit);
  return agentType;
}; // should replace getAssignedAgent

export var getAssignedAgent = getIn(ASSIGNED_AGENT);