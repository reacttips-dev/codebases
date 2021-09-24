'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var base_url = 'contacts/v1/gdpr/internal/gdpr-delete';
export var deleteContact = function deleteContact(vids, email) {
  return ImmutableAPI.post(base_url, {
    vids: vids,
    email: email
  });
};