'use es6';

import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import memoize from 'transmute/memoize';
import { isOnlyActiveSalesforceOwner } from 'customer-data-objects/owners/isActiveOwner';

var getName = function getName(owner) {
  var firstName = owner.firstName,
      lastName = owner.lastName,
      email = owner.email;
  var label = '';

  if (!firstName && !lastName && !email) {
    label = '';
  } else if (!firstName && !lastName) {
    label = email;
  } else {
    label = formatName({
      firstName: firstName,
      lastName: lastName
    });
  }

  return label;
};

var formatDeactivated = function formatDeactivated(owner) {
  var firstName = owner.firstName,
      lastName = owner.lastName,
      email = owner.email;
  var name = email || formatName({
    firstName: firstName,
    lastName: lastName
  });
  return I18n.text('customerDataObjects.OwnerName.deactivated', {
    name: name
  });
};

export var format = memoize(function (owner) {
  if (!owner) {
    return undefined;
  }

  if (!owner.active) {
    return formatDeactivated(owner);
  }

  if (owner.ownerId === '__hs__ME') {
    return I18n.text('customerDataObjects.OwnerIdSelect.me');
  }

  var label = getName(owner);

  if (label && isOnlyActiveSalesforceOwner(owner)) {
    label = label + " (Salesforce)";
  }

  return label;
});
export var formatWithEmail = memoize(function (owner) {
  if (!owner) {
    return undefined;
  }

  if (owner.ownerId === '__hs__ME') {
    return I18n.text('customerDataObjects.OwnerIdSelect.me');
  }

  var email = owner.email,
      active = owner.active;
  var label = format(owner);

  if (!owner || !active || isOnlyActiveSalesforceOwner(owner)) {
    return label;
  } else if (email && label && label !== email) {
    label += " (" + email + ")";
  }

  return label;
});