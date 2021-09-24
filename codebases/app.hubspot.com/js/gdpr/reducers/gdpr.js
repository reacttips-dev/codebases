'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap } from 'immutable';
import { combineActions, handleActions } from 'flux-actions';
import { CONSENT_TO_PROCESS_SUCCEEDED, CONSENT_TO_PROCESS_FAILED, DISMISS_CONSENT_TO_COMMUNICATE_ERROR } from '../constants/ActionTypes';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { REFRESH_WIDGET_DATA } from '../../widget-data/constants/actionTypes';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { SHOULD_NOT_ASK_FOR_CONSENT } from 'conversations-internal-schema/widget-data/records/GDPRConsentToProcessStatusTypes';
import { getGDPRConsentToProcessStatus } from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
var initialState = ImmutableMap({
  consentToProcessStatus: SHOULD_NOT_ASK_FOR_CONSENT,
  consentToProcessError: false
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionTypes.GET_WIDGET_DATA_SUCCEEDED, function (state, action) {
  var widgetData = action.payload;
  return state.set('consentToProcessStatus', getGDPRConsentToProcessStatus(widgetData));
}), _defineProperty(_handleActions, REFRESH_WIDGET_DATA, function (state, action) {
  var widgetData = action.payload;
  return state.set('consentToProcessStatus', getGDPRConsentToProcessStatus(widgetData));
}), _defineProperty(_handleActions, combineActions(CREATE_NEW_THREAD.SUCCEEDED, CONSENT_TO_PROCESS_SUCCEEDED), function (state) {
  return state.set('consentToProcessStatus', SHOULD_NOT_ASK_FOR_CONSENT);
}), _defineProperty(_handleActions, CONSENT_TO_PROCESS_FAILED, function (state) {
  return state.set('consentToProcessError', true);
}), _defineProperty(_handleActions, DISMISS_CONSENT_TO_COMMUNICATE_ERROR, function (state) {
  return state.set('consentToProcessError', false);
}), _handleActions), initialState);