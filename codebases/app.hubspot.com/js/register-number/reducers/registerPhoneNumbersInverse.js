'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import * as TwilioRegisterStates from 'calling-settings-ui-library/number-registration/constants/TwilioRegisterStates';
import { RESET_HUBSPOT_REGISTRATION_STATE } from '../actions/RegisterHubSpotNumberActionTypes';
var _defaults = {
  state: TwilioRegisterStates.WAITING,
  verificationSid: '',
  errorCode: null,
  isErrored: false,
  shouldRenderContactSupportForm: false,
  numCodesSent: 0,
  verifyCodeAttempts: 0
};
var initialState = fromJS(_defaults);

var registerPhoneNumbersInverseReducer = _defineProperty({}, RESET_HUBSPOT_REGISTRATION_STATE, function (state) {
  return state.merge(Object.assign({}, _defaults));
});

export default handleActions(registerPhoneNumbersInverseReducer, initialState);