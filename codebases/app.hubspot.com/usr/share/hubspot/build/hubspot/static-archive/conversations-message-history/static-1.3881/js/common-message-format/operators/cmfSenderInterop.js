'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _cmfSenderToSenderMap, _senderToCmfSenderMap;

import * as senderTypes from '../../common-message-format/constants/legacySenderTypes';
import * as cmfSenderTypes from '../constants/cmfSenderTypes';
var cmfSenderToSenderMapping = (_cmfSenderToSenderMap = {}, _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.AGENT_SENDER, senderTypes.AGENT), _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.VISITOR_SENDER, senderTypes.VISITOR), _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.BOT_SENDER, senderTypes.BOT), _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.SYSTEM_SENDER, senderTypes.SYSTEM), _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.INTEGRATOR_SENDER, senderTypes.INTEGRATOR), _defineProperty(_cmfSenderToSenderMap, cmfSenderTypes.VID_SENDER, senderTypes.VISITOR), _cmfSenderToSenderMap);
var senderToCmfSenderMapping = (_senderToCmfSenderMap = {}, _defineProperty(_senderToCmfSenderMap, senderTypes.AGENT, cmfSenderTypes.AGENT_SENDER), _defineProperty(_senderToCmfSenderMap, senderTypes.VISITOR, cmfSenderTypes.VISITOR_SENDER), _defineProperty(_senderToCmfSenderMap, senderTypes.BOT, cmfSenderTypes.BOT_SENDER), _defineProperty(_senderToCmfSenderMap, senderTypes.SYSTEM, cmfSenderTypes.SYSTEM_SENDER), _defineProperty(_senderToCmfSenderMap, senderTypes.INTEGRATOR, cmfSenderTypes.INTEGRATOR_SENDER), _senderToCmfSenderMap);
/**
 *
 * @param {string} cmfSenderType
 * @returns {string} senderType
 */

export function fromCmfSender(cmfSenderType) {
  return cmfSenderToSenderMapping[cmfSenderType];
}
/**
 *
 * @param {string} senderType
 * @returns {string} cmfSenderType
 */

export function toCmfSender(senderType) {
  return senderToCmfSenderMapping[senderType];
}