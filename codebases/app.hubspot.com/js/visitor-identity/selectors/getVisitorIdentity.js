'use es6';

import get from 'transmute/get';
export var getVisitorIdentity = function getVisitorIdentity(state) {
  return get('visitorIdentity', state);
};