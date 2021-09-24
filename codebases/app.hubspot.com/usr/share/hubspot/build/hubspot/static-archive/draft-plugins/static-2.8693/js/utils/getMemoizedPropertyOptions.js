'use es6';

import { Map as ImmutableMap } from 'immutable';
import { MergeTagDefaultOptions } from '../lib/mergeTagConstants';
import getPropertiesWithDefaults from './getPropertiesWithDefaults';

var _memoizedOptions = ImmutableMap();

var generatePropertyOptions = function generatePropertyOptions(properties) {
  return properties.toList().map(function (propertyGroup) {
    return {
      text: propertyGroup.get('displayName'),
      value: propertyGroup.get('name'),
      options: propertyGroup.get('properties').toArray().reduce(function (filteredOptions, property) {
        if (!property.get('hidden')) {
          filteredOptions.push({
            text: property.get('label'),
            value: property.get('name')
          });
        }

        return filteredOptions;
      }, [])
    };
  }).toJS();
};

export default (function (selectedType, data) {
  if (!data) {
    return null;
  }

  var properties = getPropertiesWithDefaults(data);
  var objectType = MergeTagDefaultOptions.getIn([selectedType, 'objectType']);

  if (_memoizedOptions.has(objectType)) {
    return _memoizedOptions.get(objectType);
  }

  var objectTypeProperties = properties.get(objectType);
  var result = generatePropertyOptions(objectTypeProperties);
  _memoizedOptions = _memoizedOptions.set(objectType, result);
  return result;
});