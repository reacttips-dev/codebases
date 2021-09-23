'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { fromJS } from 'immutable';
import { getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import apiClient from 'hub-http/clients/apiClient';
var BASE_URI = 'contacts/v1/contact';
var CONTACT_PROPERTIES = ['email', 'firstname', 'lastname', 'domain'];
export function fetchBatchVidOrEmail(contactIds) {
  var grouped = contactIds.groupBy(function (contactId) {
    return isNaN(Number(contactId)) ? 'email' : 'vid';
  });
  var vidContactIds = grouped.get('vid');
  var emailContactIds = grouped.get('email');
  var vidFetch = vidContactIds ? apiClient.get('contacts/v1/contact/vids/batch', {
    query: {
      vid: vidContactIds.toArray(),
      property: CONTACT_PROPERTIES
    }
  }) : Promise.resolve({});
  var emailFetch = emailContactIds ? apiClient.get('contacts/v1/contact/emails/batch', {
    query: {
      email: emailContactIds ? emailContactIds.toArray() : [],
      property: CONTACT_PROPERTIES
    }
  }) : Promise.resolve({});
  return Promise.all([vidFetch, emailFetch]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        contactsByVid = _ref2[0],
        contactsByEmail = _ref2[1];

    return Object.assign({}, contactsByVid, {}, contactsByEmail);
  }).then(fromJS).then(function (contacts) {
    return contacts.map(function (contact) {
      return ContactRecord(contact);
    });
  }).then(function (contactMap) {
    if (!emailContactIds || contactIds.size === contactMap.size) {
      return contactMap;
    }

    var emailsWithoutContacts = emailContactIds.filter(function (email) {
      return !contactMap.find(function (contact) {
        return getProperty(contact, 'email') === email;
      });
    });
    return emailsWithoutContacts.reduce(function (map, email) {
      return map.set(email, setProperty(ContactRecord(), 'email', email));
    }, contactMap);
  });
}

function fetchByEmail(email) {
  if (!email) {
    return Promise.resolve(setProperty(ContactRecord(), 'email', email));
  }

  var url = BASE_URI + "/email/" + email + "/profile";
  return apiClient.get(url).then(function (contactData) {
    return ContactRecord(fromJS(contactData));
  }, function () {
    return setProperty(ContactRecord(), 'email', email);
  });
}

function fetchByVid(vid) {
  return apiClient.get('contacts/v1/contact/vids/batch', {
    query: {
      vid: [vid],
      property: CONTACT_PROPERTIES
    }
  }).then(function (contactData) {
    return ContactRecord(fromJS(contactData[vid]));
  });
}

export function fetchContact(contactId) {
  return typeof contactId === 'number' ? fetchByVid(contactId) : fetchByEmail(contactId);
}
export function updateContactProperties(vid, properties) {
  var url = BASE_URI + "/vid/" + vid + "/profile";
  var data = {
    vid: vid,
    properties: properties
  };
  return apiClient.post(url, {
    data: data
  });
}
export function checkCommunicationPermissions(vids) {
  return apiClient.post('crm-permissions/v1/check-permissions', {
    data: {
      contacts: vids
    }
  }).then(fromJS);
}