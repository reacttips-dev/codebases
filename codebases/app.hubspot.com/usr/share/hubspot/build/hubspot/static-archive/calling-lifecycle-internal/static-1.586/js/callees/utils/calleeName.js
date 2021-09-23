'use es6';

import get from 'transmute/get';
import { getAdditionalProperties, getObjectName, getObjectType } from '../operators/calleesOperators';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import formatName from 'I18n/utils/formatName';

function findPropertyByName(propertyName, propertiesMap) {
  if (!propertiesMap) {
    return null;
  }

  var property = propertiesMap.get(propertyName);
  return property || null;
}

export function calleeName(calleeObject) {
  var objectType = getObjectType(calleeObject);
  var objectName = getObjectName(calleeObject);

  switch (objectType) {
    case CONTACT:
      {
        var additionalProperties = getAdditionalProperties(calleeObject);
        var firstNameProperty = findPropertyByName('firstname', additionalProperties);
        var lastNameProperty = findPropertyByName('lastname', additionalProperties);
        var emailProperty = findPropertyByName('email', additionalProperties);
        var firstName = get('value', firstNameProperty);
        var lastName = get('value', lastNameProperty);
        var email = get('value', emailProperty);
        return formatName({
          firstName: firstName,
          lastName: lastName,
          email: email,
          name: objectName
        });
      }

    default:
      return objectName;
  }
}