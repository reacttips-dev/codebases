'use es6';

import indexBy from '../lib/indexBy';

var identity = function identity(v) {
  return v;
};

var createPropertiesGetterFromGroups = function createPropertiesGetterFromGroups(getGroups) {
  var mapper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  return function () {
    return getGroups().then(function (groups) {
      return mapper(indexBy(function (property) {
        return property.get('name');
      }, groups.map(function (group) {
        return group.get('properties');
      }).flatten(1)));
    });
  };
};

export default createPropertiesGetterFromGroups;