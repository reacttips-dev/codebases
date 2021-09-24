'use es6';

import { addError } from 'customer-data-ui-utilities/alerts/Alerts';
import links from 'crm-legacy-links/links';
export function handleContactExistsError(nextProperties, error) {
  if (error.responseJSON && error.responseJSON.message) {
    if (error.responseJSON.error === 'CONTACT_EXISTS') {
      var email = nextProperties.get('email');
      var id = "nonunique-email-" + email;
      var message = 'profileSidebarModule.contactAlreadyExists';
      var options = {
        profileUrl: links.contactEmail(email),
        email: email
      };
      addError(message, options, {
        id: id
      });
    } else {
      addError(error.responseJSON.message);
    }
  }
}