'use es6';

import pluck from 'transmute/pluck';
export var getPropertiesFromView = function getPropertiesFromView(_ref) {
  var columns = _ref.columns;
  return pluck('name', columns).toArray();
};