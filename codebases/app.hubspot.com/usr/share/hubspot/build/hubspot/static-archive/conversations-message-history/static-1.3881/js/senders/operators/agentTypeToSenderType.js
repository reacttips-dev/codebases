'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _agentToSenderMapping, _agentToCMFSenderMapp;

import * as AgentTypes from '../../common-message-format/constants/agentTypes';
import * as SenderTypes from '../../common-message-format/constants/legacySenderTypes';
import * as CmfSenderTypes from '../../common-message-format/constants/cmfSenderTypes';
var agentToSenderMapping = (_agentToSenderMapping = {}, _defineProperty(_agentToSenderMapping, AgentTypes.HUMAN, SenderTypes.AGENT), _defineProperty(_agentToSenderMapping, AgentTypes.BOT, SenderTypes.BOT), _agentToSenderMapping);
var agentToCMFSenderMapping = (_agentToCMFSenderMapp = {}, _defineProperty(_agentToCMFSenderMapp, AgentTypes.HUMAN, CmfSenderTypes.AGENT_SENDER), _defineProperty(_agentToCMFSenderMapp, AgentTypes.BOT, CmfSenderTypes.BOT_SENDER), _agentToCMFSenderMapp);
/**
 *
 * @param {String} agentType
 * @returns {String} senderType
 */

export var agentTypeToSenderType = function agentTypeToSenderType(agentType) {
  return agentToSenderMapping[agentType];
};
export var agentTypeToCMFSenderType = function agentTypeToCMFSenderType(agentType) {
  return agentToCMFSenderMapping[agentType];
};