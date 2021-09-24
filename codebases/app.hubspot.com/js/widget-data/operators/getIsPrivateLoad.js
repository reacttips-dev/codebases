'use es6';

import get from 'transmute/get';
export var getIsPrivateLoad = function getIsPrivateLoad(data) {
  return get('privateLoad', data);
};