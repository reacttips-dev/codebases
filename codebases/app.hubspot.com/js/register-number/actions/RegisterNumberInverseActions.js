'use es6';

import { createAction } from 'redux-actions';
import { RESET_HUBSPOT_REGISTRATION_STATE } from './RegisterHubSpotNumberActionTypes';
export var resetHubSpotRegistration = createAction(RESET_HUBSPOT_REGISTRATION_STATE);