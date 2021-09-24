'use es6';

import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import indexBy from 'transmute/indexBy';
import reduce from 'transmute/reduce';

var formatPropertyReference = function formatPropertyReference(property) {
  return new ReferenceRecord({
    id: property.name,
    label: property.label,
    description: property.type,
    referencedObject: fromJS(property)
  });
};

var formatProperties = function formatProperties(propertyGroups) {
  return reduce(ImmutableMap(), function (acc, propertyGroup) {
    return acc.merge(indexBy(get('id'), List(propertyGroup.properties).map(formatPropertyReference)));
  }, List(propertyGroups));
};

export default formatProperties;