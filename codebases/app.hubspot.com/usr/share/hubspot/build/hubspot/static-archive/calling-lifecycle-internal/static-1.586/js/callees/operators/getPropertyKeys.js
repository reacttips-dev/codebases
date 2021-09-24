'use es6';

import { OrderedMap } from 'immutable';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { getObjectId, getObjectTypeId } from './calleesOperators';
export var createPropertyKey = function createPropertyKey(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectId = _ref.objectId;
  return objectTypeId + "_" + objectId;
};
export var getRequiredCalleeProperties = function getRequiredCalleeProperties(_ref2) {
  var callableObjects = _ref2.callableObjects,
      propertyKeySeq = _ref2.propertyKeySeq,
      _ref2$searchResults = _ref2.searchResults,
      searchResults = _ref2$searchResults === void 0 ? OrderedMap() : _ref2$searchResults;
  return callableObjects.merge(searchResults).reduce(function (acc, object) {
    var objectTypeId = getObjectTypeId(object);
    var objectId = getObjectId(object);
    var key = createPropertyKey({
      objectTypeId: objectTypeId,
      objectId: objectId
    });

    if (propertyKeySeq.includes(key)) {
      return acc;
    }

    if (objectTypeId === COMPANY_TYPE_ID) {
      acc.companyIds.push(getObjectId(object));
    } else if (objectTypeId === CONTACT_TYPE_ID) {
      acc.contactIds.push(getObjectId(object));
    }

    acc.keys.push(key);
    return acc;
  }, {
    contactIds: [],
    companyIds: [],
    keys: []
  });
};