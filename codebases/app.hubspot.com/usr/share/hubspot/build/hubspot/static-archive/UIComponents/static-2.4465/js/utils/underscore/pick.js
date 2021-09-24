'use es6';

import objectFilter from './objectFilter';
/**
 * @param {Object} object - object to run filters on
 * @param {String|String[]} filters - property name or names to include
 */

var pick = function pick(object) {
  for (var _len = arguments.length, filters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    filters[_key - 1] = arguments[_key];
  }

  return objectFilter.apply(void 0, [object, true].concat(filters));
};

export default pick;