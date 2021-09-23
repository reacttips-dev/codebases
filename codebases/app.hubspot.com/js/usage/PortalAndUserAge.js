'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS } from 'immutable';
import once from 'transmute/once';
import fulcrum from 'FulcrumJS.fulcrum';
export default {
  get: once(function () {
    return Promise.all([fulcrum.getUserAge(), fulcrum.getPortalAge()]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          userAge = _ref2[0],
          portalAge = _ref2[1];

      return fromJS({
        user: {
          days: userAge.days,
          months: userAge.months
        },
        portal: {
          days: portalAge.days,
          months: portalAge.months
        }
      });
    });
  })
};