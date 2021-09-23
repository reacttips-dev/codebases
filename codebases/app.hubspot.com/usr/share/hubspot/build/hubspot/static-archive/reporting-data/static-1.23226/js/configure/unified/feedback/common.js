'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

var findFiltersByType = function findFiltersByType(type) {
  return function (filters) {
    return filters.filter(function (_ref) {
      var property = _ref.property;
      return property.indexOf(type) === 0;
    }).map(function (_ref2) {
      var property = _ref2.property,
          restFilter = _objectWithoutProperties(_ref2, ["property"]);

      return Object.assign({}, restFilter, {
        property: property.replace(type + ".", '')
      });
    });
  };
};

export var findContactFilters = findFiltersByType('contactFilters');
export var findEngagementFilters = findFiltersByType('engagementFilters');
export var findSubmissionFilters = findFiltersByType('submissionFilters');