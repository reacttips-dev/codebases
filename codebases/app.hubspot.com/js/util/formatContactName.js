'use es6';

import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
export default (function (contact) {
  var fullName = formatName({
    firstName: getProperty(contact, 'firstname'),
    lastName: getProperty(contact, 'lastname')
  });
  var email = getProperty(contact, 'email');

  if (fullName === '' && !email) {
    return I18n.text('summary.enroll.table.noContactName');
  }

  if (!email) {
    return fullName;
  }

  if (fullName === '') {
    return email;
  }

  return I18n.text('summary.enroll.table.formattedName', {
    fullName: fullName,
    email: email
  });
});