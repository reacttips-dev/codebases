'use es6';

import * as PropertyTypes from '../../../constants/property-types';
import { Map as ImmutableMap } from 'immutable';
export default function overridePropertyTypes(spec) {
  return function (properties) {
    var overridden = properties.map(function (property) {
      var propertyKey = property.get('name');

      if (spec.hasIn(['properties', 'types', propertyKey])) {
        return property.set('type', spec.getIn(['properties', 'types', propertyKey]));
      }

      return property;
    });
    overridden = overridden.update(spec.getIn(['properties', 'idProperty']), ImmutableMap(), function (idPropDef) {
      return idPropDef.set('type', PropertyTypes.ENUMERATION);
    });
    return overridden;
  };
}