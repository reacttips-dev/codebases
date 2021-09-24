'use es6';

import { validateProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateProperty';
export var validateScreen = function validateScreen(screen) {
  var isValidScreen = typeof screen === 'string' && screen.length > 0;
  return validateProperty(isValidScreen, "expected screen to be a non-empty string but got " + screen, 'screen');
};