'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _callSettingsReducer;

import { handleActions } from 'redux-actions';
import Engagement, { CALL_META_PROPERTIES, CALL_ENGAGEMENT_PROPERTIES } from 'calling-client-interface/records/engagement/Engagement';
import setIn from 'transmute/setIn';
import { SET_ENGAGEMENT_DATA, SET_CALL_DISPOSITION, SET_ACTIVITY_TYPE, SET_NOTES, SET_NON_TWILIO_BET_PROPERTIES } from '../actions/ActionTypes';
import { RESET_CALL_DATA, SET_END_CALL_DATA } from '../../active-call-settings/actions/ActionTypes';
var initialState = new Engagement();

var setProperty = function setProperty(property, value, engagement) {
  return setIn(['properties', property, 'value'], value, engagement);
};

var callSettingsReducer = (_callSettingsReducer = {}, _defineProperty(_callSettingsReducer, RESET_CALL_DATA, function () {
  return initialState;
}), _defineProperty(_callSettingsReducer, SET_END_CALL_DATA, function (state, _ref) {
  var payload = _ref.payload;
  if (!payload.engagement) return state;
  return Engagement.mergeProperties(payload.engagement.properties, state);
}), _defineProperty(_callSettingsReducer, SET_ENGAGEMENT_DATA, function (state, _ref2) {
  var payload = _ref2.payload;
  if (!payload.callCrmObjectId) return state;
  return state.set('objectId', payload.callCrmObjectId);
}), _defineProperty(_callSettingsReducer, SET_CALL_DISPOSITION, function (state, _ref3) {
  var payload = _ref3.payload;
  return setProperty(CALL_META_PROPERTIES.disposition, payload, state);
}), _defineProperty(_callSettingsReducer, SET_ACTIVITY_TYPE, function (state, _ref4) {
  var payload = _ref4.payload;
  return setProperty(CALL_ENGAGEMENT_PROPERTIES.activityType, payload, state);
}), _defineProperty(_callSettingsReducer, SET_NOTES, function (state, _ref5) {
  var payload = _ref5.payload;
  var updatedEngagement = setProperty(CALL_META_PROPERTIES.body, payload.html, state);

  if (payload.atMentions && payload.atMentions.size !== 0) {
    var atMentionsString = payload.atMentions.reduce(function (str, id) {
      return str + ";" + id;
    }, '').substring(1);
    updatedEngagement = setProperty(CALL_ENGAGEMENT_PROPERTIES.atMentionedOwnerIds, atMentionsString, updatedEngagement);
  }

  return updatedEngagement;
}), _defineProperty(_callSettingsReducer, SET_NON_TWILIO_BET_PROPERTIES, function (state, _ref6) {
  var payload = _ref6.payload;

  var _ref7 = payload || {},
      activityType = _ref7.activityType,
      followUpAction = _ref7.followUpAction,
      product = _ref7.product,
      unknownVisitorConversation = _ref7.unknownVisitorConversation;

  if (activityType) {
    state = setProperty(CALL_ENGAGEMENT_PROPERTIES.activityType, activityType, state);
  }

  if (product) {
    state = setProperty(CALL_ENGAGEMENT_PROPERTIES.productName, product, state);
  }

  if (followUpAction) {
    state = setProperty(CALL_ENGAGEMENT_PROPERTIES.followUpAction, followUpAction, state);
  }

  if (unknownVisitorConversation) {
    state = setProperty(CALL_META_PROPERTIES.unknownVisitorConversation, unknownVisitorConversation, state);
  }

  return state;
}), _callSettingsReducer);
export default handleActions(callSettingsReducer, initialState);