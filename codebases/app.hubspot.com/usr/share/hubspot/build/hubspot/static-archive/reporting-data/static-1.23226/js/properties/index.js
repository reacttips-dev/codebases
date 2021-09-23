'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { Map as ImmutableMap } from 'immutable';
import { Promise } from '../lib/promise';
import { MissingPropertiesException } from '../exceptions';
import getTotalProperty from './partial/total-property';
import { customObjectCountProperty } from './partial/count-property';
import propertyGetters from './data-type';
import { isSupportedCrmObject, getCrmObjectProperties, getCrmObjectPluralName } from '../crmObjects/utils';

var mergeMemoize = function mergeMemoize(fn) {
  var cache = ImmutableMap();

  var memoized = function memoized(key) {
    if (cache.has(key)) {
      return Promise.resolve(cache);
    }

    return fn(key).then(function (result) {
      cache = cache.set(key, result);
      return cache;
    });
  };

  memoized.reset = function () {
    return cache = ImmutableMap();
  };

  return memoized;
};

var handleShowCurrencySymbol = function handleShowCurrencySymbol(properties) {
  return properties.map(function (propertyInfo) {
    return propertyInfo.get('showCurrencySymbol', false) ? propertyInfo.set('type', 'currency') : propertyInfo;
  });
};

var handleDuration = function handleDuration(properties) {
  return properties.map(function (propertyInfo) {
    return propertyInfo.get('numberDisplayHint', false) === 'duration' ? propertyInfo.set('type', 'duration') : propertyInfo;
  });
};

var handleIdProperties = function handleIdProperties(properties) {
  return properties.map(function (propertyInfo) {
    return propertyInfo.get('type') === 'number' && propertyInfo.get('externalOptions', false) && propertyInfo.get('referencedObjectType') !== null ? propertyInfo.set('type', 'id') : propertyInfo;
  });
};

var getProperties = function getProperties(dataType) {
  if (isSupportedCrmObject(dataType)) {
    return Promise.all([getCrmObjectProperties(dataType), getCrmObjectPluralName(dataType)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          propertyList = _ref2[0],
          pluralName = _ref2[1];

      return propertyList.reduce(function (obj, value) {
        return obj.merge(ImmutableMap(_defineProperty({}, value.get('name'), value)));
      }, ImmutableMap({})).merge(getTotalProperty()).merge(customObjectCountProperty(pluralName));
    }).then(handleShowCurrencySymbol).then(handleDuration).then(handleIdProperties);
  } else if (propertyGetters.has(dataType)) {
    return propertyGetters.get(dataType).getProperties().then(function (properties) {
      return properties.merge(getTotalProperty());
    }).then(handleShowCurrencySymbol).then(handleDuration).then(handleIdProperties);
  } else {
    return Promise.reject(new MissingPropertiesException(dataType));
  }
};

export default mergeMemoize(getProperties);