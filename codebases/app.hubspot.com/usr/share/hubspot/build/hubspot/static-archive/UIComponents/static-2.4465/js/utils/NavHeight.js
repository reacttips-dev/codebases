'use es6';

import { NAV_BAR_HEIGHT } from 'HubStyleTokens/sizes';
var defaultNavHeight = null;
export var setDefaultNavHeight = function setDefaultNavHeight(navHeight) {
  defaultNavHeight = navHeight;
};
export var getDefaultNavHeight = function getDefaultNavHeight() {
  return defaultNavHeight || parseInt(NAV_BAR_HEIGHT, 10);
};