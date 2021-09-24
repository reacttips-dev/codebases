'use es6';

import { createAction } from 'redux-actions';
import { THIRD_PARTY_STATUS_CHANGE, THIRD_PARTY_LOG_IN, THIRD_PARTY_LOG_OUT } from '../constants/ThirdPartyCallingActionTypes';
export var thirdPartyStatusChange = createAction(THIRD_PARTY_STATUS_CHANGE);
export var thirdPartyLogIn = createAction(THIRD_PARTY_LOG_IN);
export var thirdPartyLogOut = createAction(THIRD_PARTY_LOG_OUT);