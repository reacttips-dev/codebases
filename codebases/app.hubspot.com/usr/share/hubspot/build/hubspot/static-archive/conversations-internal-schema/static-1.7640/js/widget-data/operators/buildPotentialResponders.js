'use es6';

import { List } from 'immutable';
var MAX_POTENTIAL_RESPONDERS = 3;
export var buildPotentialResponders = function buildPotentialResponders(sendFrom, responders) {
  var hasAgentResponders = responders && responders.size > 0;
  var hasSendFromResponders = sendFrom && sendFrom.size > 0;

  if (!hasSendFromResponders && !hasAgentResponders) {
    return List();
  }

  if (hasSendFromResponders) {
    return sendFrom.take(MAX_POTENTIAL_RESPONDERS);
  }

  return responders.take(MAX_POTENTIAL_RESPONDERS);
};