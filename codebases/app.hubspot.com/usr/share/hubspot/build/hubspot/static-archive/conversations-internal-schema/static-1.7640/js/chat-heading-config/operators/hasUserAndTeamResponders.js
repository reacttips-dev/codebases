'use es6';

import { USERS_AND_TEAMS } from '../constants/ChatHeadingConfigTypes';
import { getFallback, getType } from './chatHeadingConfigGetters';
export var hasUserAndTeamResponders = function hasUserAndTeamResponders(chatHeadingConfig) {
  return getType(chatHeadingConfig) === USERS_AND_TEAMS || getType(getFallback(chatHeadingConfig)) === USERS_AND_TEAMS;
};