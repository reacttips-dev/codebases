'use es6';

import { Map as ImmutableMap } from 'immutable';
import getProperties from '.';
export var getProperty = function getProperty(dataType, property) {
  return getProperties(dataType).then(function (remoteProperties) {
    return remoteProperties.getIn([dataType, property], ImmutableMap());
  });
};
export var setGetPropertyForTesting = function setGetPropertyForTesting(mockedFunction) {
  getProperty = mockedFunction;
};
export function getPropertiesMap(dataType, properties) {
  return getProperties(dataType).then(function (remoteProperties) {
    return properties.reduce(function (memo, property) {
      return memo.set(property, remoteProperties.getIn([dataType, property], ImmutableMap()));
    }, ImmutableMap());
  });
}