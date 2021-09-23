'use es6';

import { getFromObject, getPhoneNumberProperties, getPropertyName, getObjectId, getObjectTypeId, getValue, getAssociatedObjectsPage, getAssociatedObjects, getResults } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { isCallableObjectTypeId } from 'calling-lifecycle-internal/callees/operators/isCallableObjectTypeId';

var findFirstNumberPropertyWithValue = function findFirstNumberPropertyWithValue(phoneNumberProperties) {
  return phoneNumberProperties.find(function (propertyDefinition) {
    var propertyValue = getValue(propertyDefinition);
    return Boolean(propertyValue);
  });
};
/**
 * In situations where the current fromObject is Deal, Ticket or even a Contact / Company without a number
 * We'll need to search through associated records for the first callable objects with a number.
 *
 * @param {CalleesRecord} calleesRecord
 * @returns {PhoneNumberIdentifier|null}
 */


var getInitialPhoneNumberIdentifierFromAssociations = function getInitialPhoneNumberIdentifierFromAssociations(calleesRecord) {
  var associatedRecordPages = getAssociatedObjectsPage(calleesRecord);
  var propertyName;
  var callableObject;
  var firstAssociatedRecordWithPhoneNumber = associatedRecordPages && associatedRecordPages.find(function (associatedObjectType) {
    var associatedObjects = getAssociatedObjects(associatedObjectType);
    var associatedObjectWithCallableNumber = associatedObjects && getResults(associatedObjects).find(function (callable) {
      var phoneNumberProperties = getPhoneNumberProperties(callable);
      var phoneNumberProperty = findFirstNumberPropertyWithValue(phoneNumberProperties);

      if (phoneNumberProperty) {
        callableObject = callable;
        propertyName = getPropertyName(phoneNumberProperty);
        return true;
      }

      return false;
    });
    return !!associatedObjectWithCallableNumber;
  });

  if (!firstAssociatedRecordWithPhoneNumber || !propertyName || !callableObject) {
    return null;
  }

  var objectId = getObjectId(callableObject);
  var objectTypeId = getObjectTypeId(callableObject);
  return new PhoneNumberIdentifier({
    objectId: objectId,
    objectTypeId: objectTypeId,
    propertyName: propertyName
  });
};
/**
 * Attempts to return a toNumberIdentifier if the fromObject is a callable object itself.
 *
 * @param {CalleesRecord} calleesRecord
 * @returns {PhoneNumberIdentifier|null}
 */


var getInitialPhoneNumberIdentifierFromObject = function getInitialPhoneNumberIdentifierFromObject(calleesRecord) {
  var fromObject = getFromObject(calleesRecord);
  var fromObjectPhoneNumberProperties = getPhoneNumberProperties(fromObject);
  var firstPhoneNumberPropertyWithValue = fromObjectPhoneNumberProperties && findFirstNumberPropertyWithValue(fromObjectPhoneNumberProperties);
  var propertyName = firstPhoneNumberPropertyWithValue && getPropertyName(firstPhoneNumberPropertyWithValue);

  if (!propertyName) {
    propertyName = null;
  }

  var objectId = getObjectId(fromObject);
  var objectTypeId = getObjectTypeId(fromObject);
  return new PhoneNumberIdentifier({
    objectId: objectId,
    objectTypeId: objectTypeId,
    propertyName: propertyName
  });
};

export var getInitialPhoneNumberIdentifier = function getInitialPhoneNumberIdentifier(calleesRecord, state) {
  var currentRecordToNumberIdentifier = getInitialPhoneNumberIdentifierFromObject(calleesRecord);
  var associatedToNumberIdentifier;

  if (!currentRecordToNumberIdentifier.get('propertyName')) {
    associatedToNumberIdentifier = getInitialPhoneNumberIdentifierFromAssociations(calleesRecord);
  }

  if (associatedToNumberIdentifier) {
    return state.set('toNumberIdentifier', associatedToNumberIdentifier);
  }

  var objectTypeId = currentRecordToNumberIdentifier.get('objectTypeId');

  if (!isCallableObjectTypeId(objectTypeId)) {
    return state.set('toNumberIdentifier', null);
  }

  return state.set('toNumberIdentifier', currentRecordToNumberIdentifier);
};