'use es6';

import { List } from 'immutable';
import { hasUserAndTeamResponders } from 'conversations-internal-schema/chat-heading-config/operators/hasUserAndTeamResponders';
var MAX_POTENTIAL_RESPONDERS = 3;
export function chatHeadingRespondersList(_ref) {
  var _ref$assignedResponde = _ref.assignedResponder,
      assignedResponder = _ref$assignedResponde === void 0 ? null : _ref$assignedResponde,
      chatHeadingConfig = _ref.chatHeadingConfig,
      responders = _ref.responders,
      _ref$sendFromResponde = _ref.sendFromResponders,
      sendFromResponders = _ref$sendFromResponde === void 0 ? responders : _ref$sendFromResponde;
  var respondersToPass = assignedResponder ? List([assignedResponder]) : sendFromResponders;
  var chatHeadingResponders = !respondersToPass.size && (hasUserAndTeamResponders(chatHeadingConfig) || !chatHeadingConfig) ? responders : respondersToPass;
  return chatHeadingResponders.take(MAX_POTENTIAL_RESPONDERS);
}