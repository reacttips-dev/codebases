'use es6';

import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import isUndefined from 'transmute/isUndefined';
import { getTextContentFromHtml } from 'sanitize-text/sanitizers/HtmlSanitizer';
import { isOnlyActiveSalesforceOwner } from 'customer-data-objects/owners/isActiveOwner';
export default (function (user, options) {
  options = options || {};
  var label = '';

  if (user) {
    var name;

    if (user.toJS) {
      user = user.toJS();
    }

    if (user.toJSON) {
      user = user.toJSON();
    }

    var firstName = user.firstName || user.firstname;
    var lastName = user.lastName || user.lastname;
    var _user = user,
        email = _user.email;
    var active = isUndefined(user.active) ? true : user.active;
    var includeEmail = isUndefined(options.includeEmail) ? true : options.includeEmail;
    var isSafeString = options.isSafeString || false;
    var formatNameOptions = {
      firstName: firstName,
      lastName: lastName
    };

    if (!active) {
      name = email || formatName(formatNameOptions);

      if (isSafeString) {
        name = I18n.SafeString(name);
      }

      label = I18n.text('owners.nameAndDeactivatedUser', {
        name: name
      });
    } else if (firstName && firstName.length || lastName && lastName.length) {
      label = formatName(formatNameOptions);

      if (isOnlyActiveSalesforceOwner(user)) {
        if (isSafeString) {
          label = I18n.SafeString(label);
        }

        label = I18n.text('owners.salesforce', {
          name: label
        });
      } else if (email && email.length && includeEmail) {
        label += " (" + email + ")";
      }
    } else if (email && email.length) {
      label = email;
    }
  }

  if (label.string) {
    return I18n.SafeString(getTextContentFromHtml(label.string));
  } else {
    return getTextContentFromHtml(label);
  }
});