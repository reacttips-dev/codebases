'use es6';

import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'reference-resolvers/constants/ObjectTypeIds';
import { formatContactName } from 'reference-resolvers/formatters/formatContacts';
import always from 'transmute/always';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
var PROPERTIES = 'properties';
var VALUE = 'value';
export var defaultCustomObjectGetters = {
  getId: get('objectId'),
  getLabel: always(''),
  getArchived: function getArchived(record) {
    return getIn(['state', 'state'], record) === 'DELETED';
  }
}; // crm-search API format

export var createCustomObjectGetter = function createCustomObjectGetter(property) {
  return getIn([PROPERTIES, property, VALUE]);
};
export var getDefaultGettersByObjectTypeId = function getDefaultGettersByObjectTypeId(objectTypeId) {
  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      return {
        getLabel: formatContactName
      };

    case COMPANY_TYPE_ID:
      return {
        getLabel: getIn(['properties', 'name', 'value'])
      };

    case DEAL_TYPE_ID:
      return {
        getLabel: getIn(['properties', 'dealname', 'value'])
      };

    case TICKET_TYPE_ID:
      return {
        getLabel: getIn(['properties', 'subject', 'value'])
      };

    default:
      return {};
  }
};