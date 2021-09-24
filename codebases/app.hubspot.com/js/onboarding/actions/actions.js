'use es6';

import { createAction } from 'redux-actions';
import { RESET_ONBOARDING_STATE, SET_REGISTER_FROM_NUMBER_TYPE, SET_SHOULD_SHOW_ONBOARDING_INTRO } from './actionTypes';
export var setRegisterFromNumberType = createAction(SET_REGISTER_FROM_NUMBER_TYPE);
export var setShouldShowOnboardingIntro = createAction(SET_SHOULD_SHOW_ONBOARDING_INTRO);
export var resetOnboardingState = createAction(RESET_ONBOARDING_STATE);