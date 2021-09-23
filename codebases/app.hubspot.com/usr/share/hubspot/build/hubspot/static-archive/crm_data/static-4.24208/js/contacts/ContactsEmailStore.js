'use es6';

import { CONTACTS_FETCH_SUCCEEDED, CONTACT_EMAIL_REMOVED } from 'crm_data/actions/ActionTypes';
import { fetchByEmail } from 'crm_data/contacts/ContactsActions';
import { defineFactory } from 'general-store';
import dispatcher from 'dispatcher/dispatcher';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
var fetched = ImmutableSet();
export default defineFactory().defineName('ContactsEmailStore').defineGetInitialState(function () {
  return ImmutableMap();
}).defineGet(function (state) {
  var emailToFetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var email = emailToFetch.toLowerCase();

  if (!state.has(email) && !fetched.has(email)) {
    fetched = fetched.add(email);
    fetchByEmail(email).catch(function (error) {
      if ((error && error.status) !== 404) {
        throw error;
      }
    }).done();
  }

  return state.get(email);
}).defineResponseTo(CONTACTS_FETCH_SUCCEEDED, function (state, contacts) {
  return contacts.reduce(function (map, contact) {
    if (!contact) {
      return map;
    }

    var primaryEmail = getProperty(contact, 'email');
    map = map.set(primaryEmail ? primaryEmail.toLowerCase() : primaryEmail, contact);
    var additionalEmailsString = getProperty(contact, 'hs_additional_emails');
    var additionalEmails = additionalEmailsString && additionalEmailsString.split(';');

    if (additionalEmails) {
      additionalEmails.forEach(function (email) {
        map = map.set(email ? email.toLowerCase() : email, contact);
      });
    }

    return map;
  }, state);
}).defineResponseTo(CONTACT_EMAIL_REMOVED, function (state, _ref) {
  var email = _ref.email;
  return state.remove(email ? email.toLowerCase() : email);
}).register(dispatcher);