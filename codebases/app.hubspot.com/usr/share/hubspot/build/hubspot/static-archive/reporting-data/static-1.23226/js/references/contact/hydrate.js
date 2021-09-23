'use es6';

import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
export var idProperty = 'vid';
export var hydrateInputs = [idProperty, 'firstname', 'lastname', 'email'];
export var hydrateFn = function hydrateFn(extractedContactInfo) {
  return !extractedContactInfo ? I18n.text('reporting-data.references.contact.unknown', {
    id: extractedContactInfo[idProperty]
  }) : formatName({
    firstName: extractedContactInfo.firstname,
    lastName: extractedContactInfo.lastname,
    email: extractedContactInfo.email
  });
};