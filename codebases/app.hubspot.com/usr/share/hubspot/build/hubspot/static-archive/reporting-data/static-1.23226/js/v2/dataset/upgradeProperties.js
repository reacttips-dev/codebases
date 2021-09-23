'use es6';

import { fromJS, List } from 'immutable';
import { BUCKET_DEALPROGRESS } from '../../constants/processorTypes';
import { BUCKETS, ENUMERATION, ID, NUMBER } from '../../constants/property-types';
import { getPropertyTypeFromDisplayHint } from '../../hydrate/propertyFormatter';
var ENUM_TO_ID_PROPERTIES = ['hs_product_id', 'hs_ticket_id', 'hs_object_id', 'listMemberships.listId'];
var NUMBER_TO_ID_PROPERTIES = ['associatedcompanyid', 'hs_object_id', 'hs_created_by_user_id'];
var NUMBER_BUCKET_PROPERTIES_TO_PROCESSORS = fromJS({
  'dealstage.probability': BUCKET_DEALPROGRESS
});

var numberPropertyIsReallyBucket = function numberPropertyIsReallyBucket(property, config) {
  if (NUMBER_BUCKET_PROPERTIES_TO_PROCESSORS.has(property.get('name'))) {
    return config.get('processors', List()).includes(NUMBER_BUCKET_PROPERTIES_TO_PROCESSORS.get(property.get('name')));
  }

  return false;
};

export var upgradeProperty = function upgradeProperty(property, config) {
  if (!property) {
    return property;
  }

  var propertyType = property.get('type');
  var propertyName = property.get('name');

  if (propertyType === BUCKETS || numberPropertyIsReallyBucket(property, config)) {
    return property.set('type', ENUMERATION);
  }

  if (ENUM_TO_ID_PROPERTIES.includes(propertyName) && propertyType === ENUMERATION) {
    return property.set('type', ID);
  }

  if (NUMBER_TO_ID_PROPERTIES.includes(propertyName) && propertyType === NUMBER) {
    return property.set('type', ID);
  }

  var numberDisplayHint = property.get('numberDisplayHint');

  if (propertyType === NUMBER && numberDisplayHint) {
    return property.set('type', getPropertyTypeFromDisplayHint(numberDisplayHint));
  }

  return property;
};