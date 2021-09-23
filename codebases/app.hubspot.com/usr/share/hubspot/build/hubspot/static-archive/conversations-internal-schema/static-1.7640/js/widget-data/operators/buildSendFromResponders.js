'use es6';

import { List } from 'immutable';
import { getSendFrom } from './widgetDataGetters';
var MAX_POTENTIAL_RESPONDERS = 3;
export var buildSendFromResponders = function buildSendFromResponders(widgetData) {
  var sendFrom = getSendFrom(widgetData);
  var hasSendFromResponders = sendFrom && sendFrom.size > 0;

  if (hasSendFromResponders) {
    return sendFrom.take(MAX_POTENTIAL_RESPONDERS);
  }

  return List();
};