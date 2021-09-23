'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _onboarding;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'redux-actions';
import { HUBSPOT, TWILIO } from 'calling-lifecycle-internal/call-provider/constants/ProviderNames';
import { RESET_ONBOARDING_STATE, SET_REGISTER_FROM_NUMBER_TYPE, SET_SHOULD_SHOW_ONBOARDING_INTRO } from '../actions/actionTypes';
var initialState = ImmutableMap({
  shouldShowOnboardingIntro: false,
  registerFromNumberType: null
});
var onboarding = (_onboarding = {}, _defineProperty(_onboarding, SET_REGISTER_FROM_NUMBER_TYPE, function (state, _ref) {
  var isUsingTwilioConnect = _ref.payload.isUsingTwilioConnect;
  return state.merge({
    registerFromNumberType: isUsingTwilioConnect ? TWILIO : HUBSPOT,
    shouldShowOnboardingIntro: false
  });
}), _defineProperty(_onboarding, SET_SHOULD_SHOW_ONBOARDING_INTRO, function (state, _ref2) {
  var payload = _ref2.payload;
  return state.merge({
    registerFromNumberType: null,
    shouldShowOnboardingIntro: payload
  });
}), _defineProperty(_onboarding, RESET_ONBOARDING_STATE, function () {
  return initialState;
}), _onboarding);
export default handleActions(onboarding, initialState);