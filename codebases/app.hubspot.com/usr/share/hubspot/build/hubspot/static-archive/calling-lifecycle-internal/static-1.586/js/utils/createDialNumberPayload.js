'use es6';

import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { getObjectId, getObjectTypeId } from '../callees/operators/calleesOperators';
export function createDialNumberPayload(_ref) {
  var selectedCallee = _ref.selectedCallee,
      phoneNumber = _ref.phoneNumber,
      countryCode = _ref.countryCode,
      selectedToNumberPropertyName = _ref.selectedToNumberPropertyName,
      ownerId = _ref.ownerId,
      portalId = _ref.portalId,
      subjectId = _ref.subjectId,
      objectTypeId = _ref.objectTypeId;

  if (!selectedCallee || !phoneNumber) {
    return null;
  }

  var calleeId = getObjectId(selectedCallee);
  var calleeObjectTypeId = getObjectTypeId(selectedCallee);
  var objectType = ObjectTypeFromIds[objectTypeId];
  return {
    phoneNumber: phoneNumber,
    phone_number: phoneNumber,
    // for aircall
    countryCode: countryCode,
    calleeInfo: {
      calleeId: calleeId,
      calleeObjectTypeId: calleeObjectTypeId
    },
    ownerId: ownerId,
    subjectId: subjectId,
    objectId: subjectId,
    objectType: objectType,
    startTimestamp: Date.now(),
    portalId: portalId,
    toPhoneNumberSrc: selectedToNumberPropertyName
  };
}