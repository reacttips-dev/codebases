'use es6';

import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import isFunction from 'transmute/isFunction';
import invariant from 'react-utils/invariant';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { CONTACTS_REFRESH_QUEUED, CONTACTS_FETCH_SUCCEEDED, CONTACTS_UPDATE_STARTED, CONTACTS_UPDATE_FAILED, CONTACTS_UPDATE_SUCCEEDED, CONTACT_CREATED, CONTACTS_UPDATED, CONTACT_SECONDARY_EMAIL_REMOVED, CONTACT_SECONDARY_EMAIL_PROMOTED, CONTACT_SECONDARY_EMAIL_UPDATED, CONTACT_SECONDARY_EMAIL_ADDED, CONTACT_EMAIL_REMOVED, ASSOCIATIONS_REFRESH_QUEUED } from 'crm_data/actions/ActionTypes';
import * as ContactsAPI from 'crm_data/contacts/api/ContactsAPI';
import * as GdprDeleteAPI from 'crm_data/contacts/api/GdprDeleteAPI';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { getProperty, getId } from 'customer-data-objects/model/ImmutableModel';
import { transact } from 'crm_data/flux/transact';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import { CONTACT_TO_COMPANY, CONTACT_TO_DEAL, CONTACT_TO_TICKET } from 'crm_data/associations/AssociationTypes';
import ObjectsActions from 'crm_data/objects/ObjectsActions';

var getCreateContactPayload = function getCreateContactPayload(record) {
  return record.get('properties').reduce(function (list, _ref, property) {
    var value = _ref.value,
        source = _ref.source;
    return list.push({
      value: value,
      property: property,
      source: source
    });
  }, List());
};

var makeAssociationKey = function makeAssociationKey(id, associationType) {
  return ImmutableMap({
    objectId: id,
    objectType: CONTACT,
    associationType: associationType
  });
};

export function createContact(record, _ref2) {
  var isMarketable = _ref2.isMarketable;
  var payload = getCreateContactPayload(record);
  var method = isMarketable ? 'createMarketableContact' : 'createContact';
  return ContactsAPI[method](payload).then(function (response) {
    var contact = response.first();
    dispatchImmediate(CONTACT_CREATED, contact);
    return contact;
  });
}
export function deleteContact(vid, callback) {
  return ContactsAPI.deleteContact(vid).then(function () {
    setTimeout(function () {
      dispatchImmediate(CONTACTS_UPDATED, ImmutableMap().set("" + vid, null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  }).done();
}
export function gdprDeleteContact(vid, email, callback) {
  return GdprDeleteAPI.deleteContact([vid], email).then(function () {
    setTimeout(function () {
      dispatchImmediate(CONTACTS_UPDATED, ImmutableMap().set("" + vid, null));
    }, 0);
    return typeof callback === 'function' ? callback() : undefined;
  }).done();
}
export function fetchByEmail(email) {
  return ContactsAPI.fetchByEmail(email).then(function (contacts) {
    dispatchImmediate(CONTACTS_FETCH_SUCCEEDED, contacts);
    return contacts;
  });
}
export function refresh(contactIds) {
  dispatchQueue(CONTACTS_REFRESH_QUEUED, ImmutableSet(contactIds));
  dispatchQueue(ASSOCIATIONS_REFRESH_QUEUED, ImmutableSet([makeAssociationKey(contactIds[0], CONTACT_TO_COMPANY), makeAssociationKey(contactIds[0], CONTACT_TO_DEAL), makeAssociationKey(contactIds[0], CONTACT_TO_TICKET)]));
}
export function updateContactProperties(contact, nextProperties, errorHandler) {
  var id = "" + getId(contact);
  var properties = nextProperties.map(function (_, name) {
    return getProperty(contact, name);
  });
  dispatchImmediate(CONTACTS_UPDATE_STARTED, {
    id: id,
    properties: properties,
    nextProperties: nextProperties
  });
  return ContactsAPI.updateContactProperties(contact, nextProperties).then(function () {
    return dispatchImmediate(CONTACTS_UPDATE_SUCCEEDED, {
      id: id,
      properties: nextProperties,
      prevProperties: properties,
      contact: contact
    });
  }, function (error) {
    dispatchImmediate(CONTACTS_UPDATE_FAILED, {
      id: id,
      properties: properties,
      nextProperties: nextProperties,
      error: error
    });

    if (isFunction(errorHandler)) {
      errorHandler(nextProperties, error);
    }

    throw error;
  });
}
export function updateContacts(contacts) {
  invariant(ImmutableMap.isMap(contacts), 'ContactsActions: expected contacts to be a Map but got "%s"');
  return dispatchImmediate(CONTACTS_UPDATED, contacts);
}
export function promoteEmailToPrimary(contact, promotedEmail) {
  var vid = "" + getId(contact);
  var demotedEmail = getProperty(contact, 'email');
  var additionalEmails = getProperty(contact, 'hs_additional_emails');
  var nextAdditionalEmails = getProperty(contact, 'hs_additional_emails').split(';');
  var promotedEmailIndex = nextAdditionalEmails.indexOf(promotedEmail);
  nextAdditionalEmails.slice(promotedEmailIndex, 1);
  nextAdditionalEmails.push(demotedEmail);
  return transact({
    operation: function operation() {
      return ContactsAPI.promoteEmailToPrimary(vid, promotedEmail);
    },
    commit: [CONTACT_SECONDARY_EMAIL_PROMOTED, {
      vid: vid,
      promotedEmail: promotedEmail,
      additionalEmails: nextAdditionalEmails.join(';')
    }],
    rollback: [CONTACT_SECONDARY_EMAIL_PROMOTED, {
      vid: vid,
      additionalEmails: additionalEmails,
      promotedEmail: promotedEmail
    }]
  });
}
export function addSecondaryEmail(contact, email) {
  invariant(contact instanceof ContactRecord, 'ContactsActions: expected contact to be a ContactRecord but got "%s"');
  invariant(typeof email === 'string', 'ContactsActions: expected email to be a string but got "%s"');
  var vid = "" + getId(contact);
  return transact({
    operation: function operation() {
      return ContactsAPI.addSecondaryEmail(vid, email);
    },
    commit: [CONTACT_SECONDARY_EMAIL_ADDED, {
      vid: vid,
      email: email
    }],
    rollback: [CONTACT_SECONDARY_EMAIL_REMOVED, {
      vid: vid,
      email: email
    }]
  });
}
export function updateSecondaryEmail(contact, prevEmail, nextEmail) {
  invariant(contact instanceof ContactRecord, 'ContactsActions: expected contact to be a ContactRecord but got "%s"');
  invariant(typeof nextEmail === 'string', 'ContactsActions: expected nextEmail to be a string but got "%s"');
  invariant(typeof prevEmail === 'string', 'ContactsActions: expected prevEmail to be a string but got "%s"');
  var vid = "" + getId(contact);
  return transact({
    operation: function operation() {
      return ContactsAPI.updateSecondaryEmail(vid, prevEmail, nextEmail);
    },
    commit: [CONTACT_SECONDARY_EMAIL_UPDATED, {
      vid: vid,
      prevEmail: prevEmail,
      nextEmail: nextEmail
    }],
    rollback: [CONTACT_SECONDARY_EMAIL_UPDATED, {
      vid: vid,
      prevEmail: nextEmail,
      nextEmail: prevEmail
    }]
  });
}
export function deleteSecondaryEmail(contact, email) {
  invariant(contact instanceof ContactRecord, 'ContactsActions: expected contact to be a ContactRecord but got "%s"');
  invariant(typeof email === 'string', 'ContactsActions: expected email to be a string but got "%s"');
  var vid = "" + getId(contact);
  return transact({
    operation: function operation() {
      return ContactsAPI.deleteSecondaryEmail(vid, email);
    },
    commit: [CONTACT_SECONDARY_EMAIL_REMOVED, {
      vid: vid,
      email: email
    }],
    rollback: [CONTACT_SECONDARY_EMAIL_ADDED, {
      vid: vid,
      email: email
    }]
  });
}
export function removeEmail(contact, email) {
  var vid = "" + getId(contact);
  return ContactsAPI.removeEmail(vid, email).then(function () {
    return dispatchImmediate(CONTACT_EMAIL_REMOVED, {
      vid: vid,
      email: email
    });
  });
}
export function onPipelineChange(subject, updates, onError) {
  ObjectsActions.updateStores(subject, updates, {
    onError: onError
  });
}