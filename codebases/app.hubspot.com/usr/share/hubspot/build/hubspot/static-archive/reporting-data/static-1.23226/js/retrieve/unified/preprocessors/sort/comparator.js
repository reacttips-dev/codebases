'use es6';

import { DESC } from '../../../../constants/sortOrder';
import { identity } from './identity';
var types = ['string', 'number'];
export var comparator = function comparator() {
  var getter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
  var order = arguments.length > 1 ? arguments[1] : undefined;
  return function (a, b) {
    var first = getter(a);
    var second = getter(b);
    var flip = order === DESC ? 1 : -1;

    if (first == null) {
      return 1 * flip;
    }

    if (second == null) {
      return -1 * flip;
    }

    if (!types.includes(typeof first) && !types.includes(typeof second)) {
      return 0;
    }

    switch (typeof first) {
      case 'number':
        return ((second || 0) - (first || 0)) * flip;

      case 'string':
        return (second || '').localeCompare(first || '');

      default:
        return 0;
    }
  };
};