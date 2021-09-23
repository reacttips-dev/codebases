'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _callSettingsReducer;

import { CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { combineActions, handleActions } from 'redux-actions';
import { SETTINGS_OMNIBUS } from '../../settings-omnibus/actions/asyncActionTypes';
import getInitialLoadSettingsFromOmnibus from '../../settings-omnibus/operators/getInitialLoadSettingsFromOmnibus';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import { getPropertyFromCallableObject, getMetadata, getValidNumber } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import ActiveCallSettings from '../records/ActiveCallSettings';
import { SET_CLIENT_STATUS, SET_END_CALL_DATA, SET_SELECTED_FROM_NUMBER, SET_SELECTED_CONNECT_FROM_NUMBER, SET_CALL_END_STATUS, SET_SELECTED_CALL_METHOD, SET_TO_NUMBER_IDENTIFIER, RESET_CALL_DATA, SET_SUBJECT, SET_IS_QUEUE_TASK, SET_THREAD_ID } from '../actions/ActionTypes';
import { FETCH_CALLEES, CLEAR_CALLEES } from '../../callees/constants/calleesActionTypes';
import { getFromNumbers, getConnectNumbers } from 'calling-internal-common/initial-load-settings/record/getters';
import { READY } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { CONNECT_FROM_NUMBER, FROM_NUMBER, setPersistedConnectFromNumber, setPersistedFromNumber, setPersistedCallMethod } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
import { getInitialActiveCallSettingsProperties } from '../operators/getInitialActiveCallSettingsProperties';
import { SET_SELECTED_CALL_PROVIDER } from '../../calling-providers/actions/ActionTypes';
import { setFromNumberWithFallback } from '../operators/setFromNumberWithFallback';
import { getInitialPhoneNumberIdentifier } from '../operators/getInitialPhoneNumberIdentifier';
import { ADD_PHONE_NUMBER_PROPERTY, REMOVE_PHONE_NUMBER_PROPERTY } from '../../callee-properties/actions/asyncActionTypes';
import { SET_CALLEE_TO_UPDATE } from '../../callees/constants/addingPropertyActionTypes';
var initialState = ActiveCallSettings.fromJS(getInitialActiveCallSettingsProperties());
var callSettingsReducer = (_callSettingsReducer = {}, _defineProperty(_callSettingsReducer, SET_CLIENT_STATUS, function (state, _ref) {
  var payload = _ref.payload;
  return state.set('clientStatus', payload);
}), _defineProperty(_callSettingsReducer, RESET_CALL_DATA, function (state) {
  return state.merge({
    clientStatus: READY,
    callEndStatus: null
  });
}), _defineProperty(_callSettingsReducer, SET_CALL_END_STATUS, function (state, _ref2) {
  var payload = _ref2.payload;
  return state.set('callEndStatus', payload);
}), _defineProperty(_callSettingsReducer, SET_END_CALL_DATA, function (state, _ref3) {
  var payload = _ref3.payload;
  return state.set('clientStatus', payload.updatedStatus).set('callEndStatus', payload.callEndStatus);
}), _defineProperty(_callSettingsReducer, SET_SELECTED_FROM_NUMBER, function (state, _ref4) {
  var payload = _ref4.payload;
  setPersistedFromNumber(payload);
  return state.set('selectedFromNumber', payload);
}), _defineProperty(_callSettingsReducer, SET_SELECTED_CONNECT_FROM_NUMBER, function (state, _ref5) {
  var payload = _ref5.payload;
  setPersistedConnectFromNumber(payload);
  return state.set('selectedConnectFromNumber', payload);
}), _defineProperty(_callSettingsReducer, SET_CALLEE_TO_UPDATE, function (state, _ref6) {
  var _ref6$payload = _ref6.payload,
      calleeToUpdate = _ref6$payload.calleeToUpdate,
      callee = _ref6$payload.callee;
  if (!calleeToUpdate.propertyName) return state;
  var phoneNumber = getPropertyFromCallableObject({
    callableObject: callee,
    propertyName: calleeToUpdate.propertyName
  });
  var phoneNumberMetadata = getMetadata(phoneNumber);
  var isValidNumber = getValidNumber(phoneNumberMetadata);
  if (!isValidNumber) return state;
  return state.set('toNumberIdentifier', calleeToUpdate);
}), _defineProperty(_callSettingsReducer, SET_TO_NUMBER_IDENTIFIER, function (state, _ref7) {
  var payload = _ref7.payload;
  return state.set('toNumberIdentifier', payload.toNumberIdentifier);
}), _defineProperty(_callSettingsReducer, combineActions(ADD_PHONE_NUMBER_PROPERTY.SUCCEEDED, REMOVE_PHONE_NUMBER_PROPERTY.SUCCEEDED), function (state, _ref8) {
  var payload = _ref8.payload;
  var _payload$requestArgs = payload.requestArgs,
      objectId = _payload$requestArgs.objectId,
      objectTypeId = _payload$requestArgs.objectTypeId,
      property = _payload$requestArgs.property,
      rawValue = _payload$requestArgs.rawValue;

  if (rawValue) {
    return state.set('toNumberIdentifier', new PhoneNumberIdentifier({
      objectTypeId: objectTypeId,
      objectId: objectId,
      propertyName: property
    }));
  }

  return state.set('toNumberIdentifier', null);
}), _defineProperty(_callSettingsReducer, SETTINGS_OMNIBUS.SUCCEEDED, function (state, _ref9) {
  var payload = _ref9.payload;
  var rawInitialLoadSettings = getInitialLoadSettingsFromOmnibus(payload.data) || {};

  if (!rawInitialLoadSettings) {
    return state;
  }

  var fromNumbers = getFromNumbers(rawInitialLoadSettings);
  state = setFromNumberWithFallback({
    fromNumberKey: FROM_NUMBER,
    fromNumbers: fromNumbers,
    state: state
  });
  var connectFromNumbers = getConnectNumbers(rawInitialLoadSettings);
  state = setFromNumberWithFallback({
    fromNumberKey: CONNECT_FROM_NUMBER,
    fromNumbers: connectFromNumbers,
    state: state
  });
  return state;
}), _defineProperty(_callSettingsReducer, CLEAR_CALLEES, function (state) {
  return state.set('toNumberIdentifier', null);
}), _defineProperty(_callSettingsReducer, FETCH_CALLEES.SUCCEEDED, function (state, _ref10) {
  var _ref10$payload = _ref10.payload,
      payload = _ref10$payload === void 0 ? {} : _ref10$payload;

  if (!state.get('toNumberIdentifier')) {
    return getInitialPhoneNumberIdentifier(payload.data, state);
  }

  return state;
}), _defineProperty(_callSettingsReducer, SET_SELECTED_CALL_METHOD, function (state, _ref11) {
  var payload = _ref11.payload;
  setPersistedCallMethod(payload);
  return state.set('selectedCallMethod', payload);
}), _defineProperty(_callSettingsReducer, SET_SELECTED_CALL_PROVIDER, function (state, _ref12) {
  var payload = _ref12.payload;

  if (getIsProviderTwilioConnect(payload)) {
    setPersistedCallMethod(CALL_FROM_BROWSER);
    return state.set('selectedCallMethod', CALL_FROM_BROWSER);
  }

  return state;
}), _defineProperty(_callSettingsReducer, SET_SUBJECT, function (state, _ref13) {
  var payload = _ref13.payload;
  return state.set('subject', payload);
}), _defineProperty(_callSettingsReducer, SET_IS_QUEUE_TASK, function (state, _ref14) {
  var payload = _ref14.payload;
  return state.set('isQueueTask', payload.isQueueTask);
}), _defineProperty(_callSettingsReducer, SET_THREAD_ID, function (state, _ref15) {
  var payload = _ref15.payload;
  return state.set('threadId', payload);
}), _callSettingsReducer);
export default handleActions(callSettingsReducer, initialState);