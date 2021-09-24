'use es6';

import { getWindowLocation } from './getWindowLocation';
export var setQueryParam = function setQueryParam(_ref) {
  var key = _ref.key,
      value = _ref.value;
  var url = getWindowLocation();
  url.upsertParam(key, value);
  window.history.replaceState(null, null, url.search);
};