'use es6';

import { validateProperty } from 'ui-addon-upgrades/_core/common/data/upgradeData/validators/validateProperty';
export var validateApp = function validateApp(app) {
  var isValidApp = typeof app === 'string' && app.length > 0;
  return validateProperty(isValidApp, "expected app to be a non-empty string but got " + app, 'app');
};