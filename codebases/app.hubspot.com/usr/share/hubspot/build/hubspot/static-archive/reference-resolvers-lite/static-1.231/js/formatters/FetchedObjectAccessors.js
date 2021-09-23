'use es6';

import get from '../lib/get';
var getId = get('id');
var getLabel = get('label');
var getDescription = get('description');
var getDisabled = get('disabled');
var getArchived = get('archived');
var getAdditionalProperties = get('additionalFields');
export var defaultFetchedObjectAccessors = {
  getId: getId,
  getLabel: getLabel,
  getDescription: getDescription,
  getDisabled: getDisabled,
  getArchived: getArchived,
  getAdditionalProperties: getAdditionalProperties
};