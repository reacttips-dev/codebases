'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import * as TwilioRegisterConstants from 'calling-settings-ui-library/number-registration/constants/TwilioRegisterStates';
import { RESET_TWILIO_CONNECT_REGISTRATION_STATE } from '../actions/TwilioConnectActionTypes';
var _defaults = {
  status: TwilioRegisterConstants.WAITING,
  phoneNumber: '',
  extension: '',
  validationCode: '',
  errorCode: null,
  isErrored: false,
  registerPhoneNumberAttempts: 0,
  shouldRenderContactSupportForm: false,
  progressionId: null
};
var initialState = fromJS(_defaults);

var registerPhoneNumberTwilioConnectReducer = _defineProperty({}, RESET_TWILIO_CONNECT_REGISTRATION_STATE, function (state) {
  return state.merge(Object.assign({}, _defaults));
});

export default handleActions(registerPhoneNumberTwilioConnectReducer, initialState);