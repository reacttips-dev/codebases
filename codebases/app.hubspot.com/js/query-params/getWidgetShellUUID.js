'use es6';

import { getWindowLocation } from './getWindowLocation';
export var getWidgetShellUUID = function getWidgetShellUUID() {
  return getWindowLocation().paramValue('uuid');
};