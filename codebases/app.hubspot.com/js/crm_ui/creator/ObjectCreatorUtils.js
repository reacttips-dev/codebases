'use es6';

import { COMPANY, CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { isResolved } from 'crm_data/flux/LoadingStatus';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import formatName from '../utils/formatName';
export var getAssociationName = function getAssociationName(ids, objectType, objects) {
  if (!ids || ids.isEmpty()) {
    return null;
  }

  if (!isResolved(objects)) {
    return undefined;
  }

  var object = objects.get(ids.first());

  if (objectType === CONTACT) {
    var firstName = getProperty(object, 'firstname');
    var lastName = getProperty(object, 'lastname');
    var email = getProperty(object, 'email');
    return formatName({
      firstName: firstName,
      lastName: lastName,
      email: email
    }, {
      includeEmail: false
    });
  }

  return getProperty(object, 'name');
};
export var getObjectsByType = function getObjectsByType(objectType, contacts, companies) {
  if (objectType === CONTACT) return contacts;
  if (objectType === COMPANY) return companies;
  return undefined;
};