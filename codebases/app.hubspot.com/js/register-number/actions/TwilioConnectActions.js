'use es6';

import { createAction } from 'redux-actions';
import { RESET_TWILIO_CONNECT_REGISTRATION_STATE } from './TwilioConnectActionTypes';
export var resetTwilioConnectRegistration = createAction(RESET_TWILIO_CONNECT_REGISTRATION_STATE);