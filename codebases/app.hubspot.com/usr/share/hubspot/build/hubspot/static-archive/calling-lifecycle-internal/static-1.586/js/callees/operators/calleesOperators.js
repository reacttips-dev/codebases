'use es6';

import { CallableObject, AssociatedObjectType } from 'calling-internal-common/callees/records/CalleesRecords';
import { List, OrderedMap } from 'immutable';
import getIn from 'transmute/getIn';
import { isCallableObjectTypeId } from './isCallableObjectTypeId'; // CalleesRecord

export var getAssociatedObjectsPage = getIn(['associatedObjectsPage']);
export var getFromObject = getIn(['fromObject']); // AssociatedObjectType

export var getAssociatedObjects = getIn(['associatedObjects']);
export var getAssociatedObjectType = getIn(['objectType']); // AssociatedObjects

export var getResults = getIn(['results']); // CallableObject

export var getPhoneNumberProperties = getIn(['phoneNumberProperties']);
export var getAdditionalProperties = getIn(['additionalProperties']);
export var getObjectId = getIn(['objectId']);
export var getObjectType = getIn(['legacyObjectType']);
export var getObjectTypeId = getIn(['objectTypeId']);
export var getObjectName = getIn(['name']);
export var getIsOptedOutOfCommunications = getIn(['optOutOfCommunications', '@ok']); // PhoneNumberProperty

export var getPropertyName = getIn(['propertyName']);
export var getLabel = getIn(['label']);
export var getHubSpotDefined = getIn(['hubspotDefined']);
export var getValue = getIn(['value']);
export var getMetadata = getIn(['metadata']); // ValidatedNumber

export var getFormattedNumber = getIn(['formattedNumber']);
export var getRawNumber = getIn(['rawNumber']);
export var getIsValid = getIn(['isValid']);
export var getCountryCode = getIn(['countryCode']); // PhoneNumberPropertyMetadata

export var getExtension = getIn(['extension']);
export var getPhoneNumber = getIn(['phoneNumber']);
export var getValidNumber = getIn(['validNumber']);
export var getPossibleNumber = getIn(['possibleNumber']);
export var getShouldValidateNumber = function getShouldValidateNumber(phoneNumberPropertyMetadata) {
  return getValidNumber(phoneNumberPropertyMetadata) || getPossibleNumber(phoneNumberPropertyMetadata);
};
export var getHasMoreCallees = function getHasMoreCallees(calleesRecord) {
  if (!calleesRecord) {
    return false;
  }

  var associatedObjectsPage = getAssociatedObjectsPage(calleesRecord);

  if (associatedObjectsPage && associatedObjectsPage.size) {
    return associatedObjectsPage.some(function (associatedObjectType) {
      return getIn(['associatedObjects', 'hasMore'], associatedObjectType);
    });
  }

  return false;
};
export var getCallableObjects = function getCallableObjects(calleesRecord) {
  if (!calleesRecord) {
    return OrderedMap();
  }

  var fromObject = getFromObject(calleesRecord);
  var associatedObjectsPage = getAssociatedObjectsPage(calleesRecord);
  var associatedNumbers = OrderedMap();
  var fromObjectTypeId = fromObject && getObjectTypeId(fromObject);

  if (isCallableObjectTypeId(fromObjectTypeId)) {
    associatedNumbers = associatedNumbers.set(CallableObject.createReferenceKey(fromObject), fromObject);
  }

  associatedObjectsPage.forEach(function (associatedObjectType) {
    var associatedObjects = getAssociatedObjects(associatedObjectType);
    var results = getResults(associatedObjects);
    associatedNumbers = associatedNumbers.merge(results);
  });
  return associatedNumbers;
};
export var getCallablePhoneNumberProperties = function getCallablePhoneNumberProperties(phoneNumberProperties) {
  if (!phoneNumberProperties) {
    return List();
  }

  return phoneNumberProperties.filter(function (phoneNumberProperty) {
    var value = getValue(phoneNumberProperty) || '';
    return Boolean(value.trim());
  });
};
export var getCallableObject = function getCallableObject(_ref, calleesRecord) {
  var objectId = _ref.objectId,
      objectTypeId = _ref.objectTypeId;
  var fromObject = getFromObject(calleesRecord);
  var fromObjectId = getObjectId(fromObject);
  var fromObjectTypeId = getObjectTypeId(fromObject);

  if (objectId === fromObjectId && objectTypeId === fromObjectTypeId) {
    return fromObject;
  }

  var referenceKey = CallableObject.createReferenceKey({
    objectId: objectId,
    objectTypeId: objectTypeId
  });
  return calleesRecord.getIn(['associatedObjectsPage', objectTypeId, 'associatedObjects', 'results', referenceKey]);
};
export var getPropertyFromCallableObject = function getPropertyFromCallableObject(_ref2) {
  var callableObject = _ref2.callableObject,
      propertyName = _ref2.propertyName;

  if (!callableObject) {
    return null;
  }

  return getIn(['phoneNumberProperties', propertyName], callableObject) || null;
};
export var getPropertyFromCallees = function getPropertyFromCallees(_ref3, calleesRecord) {
  var objectTypeId = _ref3.objectTypeId,
      objectId = _ref3.objectId,
      propertyName = _ref3.propertyName;
  var callableObject = getCallableObject({
    objectTypeId: objectTypeId,
    objectId: objectId
  }, calleesRecord);

  if (!callableObject) {
    return null;
  }

  return callableObject.getIn(['phoneNumberProperties', propertyName]) || null;
};
export var getHasAssociatedObjects = function getHasAssociatedObjects(calleesRecord) {
  if (!calleesRecord) {
    return false;
  }

  var associatedObjectsPage = getAssociatedObjectsPage(calleesRecord);

  if (associatedObjectsPage) {
    return associatedObjectsPage.some(function (associateObjectType) {
      var associatedObjects = getAssociatedObjects(associateObjectType);
      var results = getResults(associatedObjects);
      return results.size > 0;
    });
  }

  return false;
};
export var addCallee = function addCallee(callee, callees) {
  var calleeId = getObjectId(callee);
  var calleeObjectTypeId = getObjectTypeId(callee);
  var fromObject = getFromObject(callees);
  var fromObjectId = getObjectId(fromObject);
  var fromObjectTypeId = getObjectTypeId(fromObject);

  if (calleeId === fromObjectId && calleeObjectTypeId === fromObjectTypeId) {
    return callees.set('fromObject', callee);
  }

  var associatedObjectsPage = getAssociatedObjectsPage(callees);
  var referenceKey = CallableObject.createReferenceKey(callee);

  if (!associatedObjectsPage.get(calleeObjectTypeId)) {
    return callees.setIn(['associatedObjectsPage', calleeObjectTypeId], new AssociatedObjectType({
      objectTypeId: calleeObjectTypeId,
      objectType: getObjectType(callee),
      associatedObjects: {
        results: []
      }
    }).setIn(['associatedObjects', 'results', referenceKey], callee));
  }

  return callees.setIn(['associatedObjectsPage', calleeObjectTypeId, 'associatedObjects', 'results', referenceKey], callee);
};
export var deleteCallee = function deleteCallee(_ref4, callees) {
  var associationObjectId = _ref4.associationObjectId,
      associationObjectTypeId = _ref4.associationObjectTypeId;
  var referenceKey = CallableObject.createReferenceKey({
    objectId: associationObjectId,
    objectTypeId: associationObjectTypeId
  });
  var result = callees.deleteIn(['associatedObjectsPage', associationObjectTypeId, 'associatedObjects', 'results', referenceKey]);
  return result;
};