'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { TOGGLE_INITIAL_MESSAGE_BUBBLE } from '../constants/initialMessageBubbleActionTypes';
import { GET_WIDGET_DATA_SUCCEEDED } from '../../constants/VisitorActionTypes';
import { hasClientTriggers } from '../../client-triggers/operators/hasClientTriggers';
import { getMessage } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import { getPopOpenWelcomeMessage } from '../operators/getPopOpenWelcomeMessage';
import { getPopOpenWidget } from '../operators/getPopOpenWidget';
var initialState = true;
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, TOGGLE_INITIAL_MESSAGE_BUBBLE, function (state, action) {
  var visible = action.payload.visible;
  return visible;
}), _defineProperty(_handleActions, GET_WIDGET_DATA_SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var clientTriggersEnabled = hasClientTriggers(payload);
  var message = getMessage(payload);
  var openWelcomeMessage = getPopOpenWelcomeMessage(message);
  var popOpenWidget = getPopOpenWidget(message);
  if (popOpenWidget && clientTriggersEnabled) return true;
  if (openWelcomeMessage && clientTriggersEnabled) return false;
  return initialState;
}), _handleActions), initialState);