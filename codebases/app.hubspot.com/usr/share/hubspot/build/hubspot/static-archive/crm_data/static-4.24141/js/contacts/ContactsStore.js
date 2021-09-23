'use es6';

import filter from 'transmute/filter';
import dispatcher from 'dispatcher/dispatcher';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { CONTACTS } from 'crm_data/actions/ActionNamespaces';
import { definePooledObjectStore } from 'crm_data/flux/definePooledObjectStore';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import { List } from 'immutable';
import registerPooledObjectService from 'crm_data/flux/registerPooledObjectService';
import { ASSOCIATE_CONTACT_AND_COMPANY, DISASSOCIATE_CONTACT_AND_COMPANY } from 'crm_schema/association/AssociationActionTypes';
import { CONTACTS_REMOVED_FROM_LIST, CONTACTS_UPDATE_STARTED, CONTACTS_UPDATE_FAILED, CONTACT_SET, CONTACT_CREATED, CONTACT_SECONDARY_EMAIL_REMOVED, CONTACT_SECONDARY_EMAIL_PROMOTED, CONTACT_SECONDARY_EMAIL_UPDATED, CONTACT_SECONDARY_EMAIL_ADDED, CONTACT_EMAIL_REMOVED } from 'crm_data/actions/ActionTypes';
import { fetch } from 'crm_data/contacts/api/ContactsAPI';

var splitValidEmails = function splitValidEmails(emails) {
  if (!emails) {
    return [];
  }

  return emails.split(';').filter(function (val) {
    return val;
  });
};

registerPooledObjectService({
  actionTypePrefix: CONTACTS,
  fetcher: fetch
});
export default definePooledObjectStore({
  actionTypePrefix: CONTACTS
}).defineName('ContactsStore').defineResponseTo(ASSOCIATE_CONTACT_AND_COMPANY, function (state, _ref) {
  var objectId = _ref.objectId,
      subjectId = _ref.subjectId;
  var contactId = "" + objectId;

  if (!state.get(contactId)) {
    return state;
  }

  return state.setIn([contactId, 'properties', 'associatedcompanyid', 'value'], subjectId);
}).defineResponseTo(DISASSOCIATE_CONTACT_AND_COMPANY, function (state, _ref2) {
  var objectId = _ref2.objectId;
  var contactId = "" + objectId;

  if (!state.get(contactId)) {
    return state;
  }

  return state.setIn([contactId, 'properties', 'associatedcompanyid', 'value'], '');
}).defineResponseTo([CONTACT_SET, CONTACT_CREATED], function (state, contact) {
  var vid = contact.get('vid');
  return state.set("" + vid, contact);
}).defineResponseTo(CONTACTS_UPDATE_STARTED, function (state, _ref3) {
  var id = _ref3.id,
      nextProperties = _ref3.nextProperties;
  return state.updateIn([id], function (contact) {
    return nextProperties.reduce(function (acc, value, name) {
      return setProperty(acc, name, value);
    }, contact || ContactRecord({
      vid: id
    }));
  });
}).defineResponseTo(CONTACTS_UPDATE_FAILED, function (state, _ref4) {
  var id = _ref4.id,
      properties = _ref4.properties,
      nextProperties = _ref4.nextProperties;

  if (state.has(id)) {
    state = state.updateIn([id], function (contact) {
      return properties.reduce(function (acc, value, name) {
        // don't overwrite changes made since the update began
        if (nextProperties.get(name) !== getProperty(acc, name)) {
          return acc;
        }

        return setProperty(acc, name, value);
      }, contact);
    });
  }

  return state;
}).defineResponseTo(CONTACT_SECONDARY_EMAIL_REMOVED, function (state, _ref5) {
  var vid = _ref5.vid,
      email = _ref5.email;
  return state.update(vid, function (contact) {
    var additionalEmails = splitValidEmails(getProperty(contact, 'hs_additional_emails'));
    var updatedAdditionalEmails = filter(function (additionalEmail) {
      return email !== additionalEmail;
    }, additionalEmails).join(';');
    return setProperty(state.get(vid), 'hs_additional_emails', updatedAdditionalEmails);
  });
}).defineResponseTo(CONTACT_SECONDARY_EMAIL_PROMOTED, function (state, _ref6) {
  var vid = _ref6.vid,
      promotedEmail = _ref6.promotedEmail,
      additionalEmails = _ref6.additionalEmails;
  return state.update(vid, function () {
    var updatedContact = setProperty(state.get(vid), 'hs_additional_emails', additionalEmails);
    updatedContact = setProperty(updatedContact, 'email', promotedEmail);
    return updatedContact;
  });
}).defineResponseTo(CONTACT_SECONDARY_EMAIL_UPDATED, function (state, _ref7) {
  var vid = _ref7.vid,
      prevEmail = _ref7.prevEmail,
      nextEmail = _ref7.nextEmail;
  var additionalEmails = splitValidEmails(getProperty(state.get(vid), 'hs_additional_emails'));
  var prevEmailIndex = additionalEmails.indexOf(prevEmail);

  if (prevEmailIndex > -1) {
    additionalEmails.splice(prevEmailIndex, 1);
  }

  if (!Array.from(additionalEmails).includes(nextEmail)) {
    additionalEmails.push(nextEmail);
  }

  return state.update(vid, function () {
    return setProperty(state.get(vid), 'hs_additional_emails', additionalEmails.join(';'));
  });
}).defineResponseTo(CONTACT_SECONDARY_EMAIL_ADDED, function (state, _ref8) {
  var vid = _ref8.vid,
      email = _ref8.email;
  return state.update(vid, function (contact) {
    var secondaryEmailPropertyValue = getProperty(contact, 'hs_additional_emails');
    var additionalEmails = splitValidEmails(secondaryEmailPropertyValue);
    additionalEmails.push(email);
    return setProperty(state.get(vid), 'hs_additional_emails', additionalEmails.join(';'));
  });
}).defineResponseTo(CONTACT_EMAIL_REMOVED, function (state, _ref9) {
  var vid = _ref9.vid,
      email = _ref9.email;
  return state.update(vid, function (contact) {
    var additionalEmails = splitValidEmails(getProperty(contact, 'hs_additional_emails'));
    var updatedAdditionalEmails = filter(function (additionalEmail) {
      return email !== additionalEmail;
    }, additionalEmails).join(';');
    return setProperty(state.get(vid), 'hs_additional_emails', updatedAdditionalEmails);
  });
}).defineResponseTo(CONTACTS_REMOVED_FROM_LIST, function (state, _ref10) {
  var vids = _ref10.vids,
      listId = _ref10.listId;
  var result = state;

  if (vids) {
    vids.forEach(function (vid) {
      result = result.updateIn(["" + vid, 'list-memberships'], function () {
        var lists = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
        return lists.filterNot(function (list) {
          return list.get('static-list-id') === listId;
        });
      });
    });
  }

  return result;
}).register(dispatcher);