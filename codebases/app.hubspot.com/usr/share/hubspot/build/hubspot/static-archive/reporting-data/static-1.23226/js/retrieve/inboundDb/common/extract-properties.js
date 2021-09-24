'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap } from 'immutable';
import fromJSOrdered from '../../../lib/fromJSOrdered';
import * as PropertyTypes from '../../../constants/property-types';
import { getPropertyType } from '../../../properties/type';

var defaultPath = function defaultPath(propertyKey) {
  return List(['properties', propertyKey, 'value']);
};

export function getPropertyPath(propertyKey, spec) {
  if (spec.hasIn(['properties', 'responsePaths', propertyKey])) {
    return spec.getIn(['properties', 'responsePaths', propertyKey]);
  }

  return defaultPath(propertyKey);
}
var transformByType = ImmutableMap(_defineProperty({}, PropertyTypes.ENUMERATION, function (value) {
  if (List.isList(value)) {
    return value.map(function (val) {
      return val && String(val);
    });
  } else {
    return value && String(value);
  }
}));
export function extractDefault(rawImmutable, propertyPath, propertyType) {
  return transformByType.get(propertyType, function (value) {
    return value;
  })(rawImmutable.getIn(propertyPath));
}
export function getExtractForProperty(propertyKey, spec) {
  var extractor = spec.getIn(['properties', 'extractors'], ImmutableMap());

  if (extractor.has(propertyKey)) {
    return Promise.resolve(function (rawImmutable) {
      return extractor.get(propertyKey)(rawImmutable, propertyKey);
    });
  } else if (extractor.has('__default')) {
    return Promise.resolve(function (rawImmutable) {
      return spec.getIn(['properties', 'extractors', '__default'])(rawImmutable, propertyKey);
    });
  } else {
    return getPropertyType(spec.dataType, propertyKey).then(function (propertyType) {
      return function (rawImmutable) {
        return extractDefault(rawImmutable, getPropertyPath(propertyKey, spec), propertyType);
      };
    });
  }
}
export function getExtractByProperty(propertyKeys, spec) {
  var propertyKeyList = propertyKeys.toList();
  return Promise.all(propertyKeyList.map(function (propertyKey) {
    return getExtractForProperty(propertyKey, spec);
  }).toJS()).then(function (propertyExtractors) {
    return function (rawObject) {
      var rawImmutable = fromJSOrdered(rawObject);
      return ImmutableMap(propertyKeyList.map(function (propertyKey, index) {
        return [propertyKey, propertyExtractors[index](rawImmutable)];
      }).toJS());
    };
  });
}