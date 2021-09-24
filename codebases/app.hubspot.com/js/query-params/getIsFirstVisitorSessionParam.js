'use es6';

import { getWindowLocation } from './getWindowLocation';
export var getIsFirstVisitorSessionParam = function getIsFirstVisitorSessionParam() {
  return getWindowLocation().paramValue('isFirstVisitorSession') === 'true';
};