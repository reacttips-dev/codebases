import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
import { List, Record } from 'immutable';
import formatName from 'I18n/utils/formatName';
import * as ObjectRecordAccessors from 'customer-data-objects/record/ObjectRecordAccessors';
import * as ObjectRecordFormatters from 'customer-data-objects/record/ObjectRecordFormatters';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import isLegacyHubSpotObject from 'customer-data-objects/crmObject/isLegacyHubSpotObject';
export function getIdKey(record) {
  return ObjectRecordAccessors.getIdKey(record);
}
export function getId(record) {
  return ObjectRecordAccessors.getId(record);
}
export function getObjectType(record) {
  return ObjectRecordAccessors.getObjectType(record);
}
export function getProperty(record, property) {
  return ObjectRecordAccessors.getProperty(record, property);
}
export function getPropertyValue(record, property) {
  return ObjectRecordAccessors.getPropertyValue(record, property);
}
export function getCreateDate(record, objectType) {
  var createDatePropertyName = isLegacyHubSpotObject(objectType) ? 'createdate' : 'hs_createdate';
  return getProperty(record, createDatePropertyName);
}
/**
 * Returns an immutable Map of
 *
 *   propertyName => propertyValue
 *
 * Useful when using Records with older code that expects
 * serialized Backbone models.
 */

export function getPropertyMap(record) {
  return record.get('properties').map(function (propertyValue) {
    return propertyValue && propertyValue.get('value');
  });
}
export function getAssociatedCompanyId(record) {
  var objectType = getObjectType(record);

  if (objectType === ObjectTypes.CONTACT) {
    return getProperty(record, 'associatedcompanyid');
  }

  if (objectType === ObjectTypes.DEAL) {
    return (record.getIn(['associations', 'associatedCompanyIds']) || List()).first();
  }

  return undefined;
}
export function hasProperty(record, property) {
  return record.hasIn(['properties', property, 'value']);
}
/**
 * Takes either an `ObjectType` or an `ImmutableModel` and returns whether the
 * associated type is a pipelineable object.
 */

export function isPipelineable(subject) {
  var objectType;

  if (typeof subject === 'string') {
    // objectType passed in directly
    objectType = subject;
  } else if (subject instanceof Record) {
    objectType = getObjectType(subject);
  }

  if (!objectType) {
    return false;
  }

  return [ObjectTypes.DEAL, ObjectTypes.TICKET].includes(objectType);
}
/**
 * setProperty updates the value of a property on the record.
 * Optionally it can also update the `source` and `sourceId`.
 */

export function setProperty(record, property, value, source, sourceId) {
  var updateValue = function updateValue(propertyValue) {
    if (!propertyValue || typeof propertyValue.set !== 'function') {
      return propertyValue;
    }

    var next = propertyValue.set('value', value);

    if (source !== undefined) {
      next = next.set('source', source);
    }

    if (sourceId !== undefined) {
      next = next.set('sourceId', sourceId);
    }

    return next;
  };

  if (record.hasIn(['properties', property])) {
    return record.updateIn(['properties', property], updateValue);
  } // if this property wasn't already set, we need to create
  // a new PropertyValueRecord


  return record.setIn(['properties', property], updateValue(PropertyValueRecord({
    name: property
  })));
}
export function toString(record) {
  return ObjectRecordFormatters.toString(formatName, record);
}
export function toStringExpanded(record) {
  if (!record) return '';
  return record.constructor.toStringExpanded(record);
}