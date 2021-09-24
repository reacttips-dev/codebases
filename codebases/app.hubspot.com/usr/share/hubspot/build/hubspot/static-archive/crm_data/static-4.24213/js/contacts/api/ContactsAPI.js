'use es6';

import { Map as ImmutableMap } from 'immutable';
import reduce from 'transmute/reduce';
import { CONTACTS, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { userScopes } from 'crm_data/scopes/UserScopes';
import { send } from 'crm_data/api/ImmutableAPI';
import { del as sharedAPIDelete } from 'crm_data/inboundDB/sharedAPI';
import { POST, PUT, DELETE, GET } from 'crm_data/constants/HTTPVerbs';
import { EMPTY } from 'crm_data/constants/LoadingStatus';
import { getQueryParams } from './ContactsExtraParams';
import { byIds } from './ContactsAPIQuery';
var BASE_URI = 'contacts/v1/contact';
var BASE_URI_V2 = 'contacts/v2/contact';
var BASE_URI_V3 = 'contacts/v3/contacts';
var URI_CREATE = 'companies/v2/create-contact';
var URI_CREATE_MARKETABLE = 'companies/v2/create-contact?setMarketable=true';
var CONTACT_EMAIL = 'contacts/v1/contactemail';

var getParamOptions = function getParamOptions() {
  return userScopes().then(function (scopes) {
    return ImmutableMap({
      showListMemberships: scopes.has('contacts-lists-read')
    });
  });
};

export function createContact(payload) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: POST
  }, URI_CREATE, {
    properties: payload
  }, function (result) {
    return ImmutableMap().set(result.vid, ContactRecord.fromJS(result));
  });
}
export function createMarketableContact(payload) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: POST
  }, URI_CREATE_MARKETABLE, {
    properties: payload
  }, function (result) {
    return ImmutableMap().set(result.vid, ContactRecord.fromJS(result));
  });
}
export function deleteContact(vid) {
  return sharedAPIDelete(BASE_URI + "/vid/" + vid);
}
export function fetch(ids) {
  var query = byIds(ids);
  return getParamOptions().then(function (options) {
    return send({
      headers: {
        'X-Properties-Source': CONTACTS,
        'X-Properties-SourceId': CRM_UI
      },
      type: GET
    }, BASE_URI + "/vids/batch/", getQueryParams(options).merge(query), function (result) {
      return reduce(ImmutableMap(), function (coll, val, key) {
        return coll.set(key, ContactRecord.fromJS(val));
      }, result);
    }).catch(function (error) {
      if (error.status === 404) {
        return EMPTY;
      }

      throw error;
    });
  });
}
export function fetchByEmail(email) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: POST
  }, // we use a batch endpoint here as the single-fetch endpoint requires
  // putting the contact email in the uri itself, which is a security risk
  // for more info see https://issues.hubspotcentral.com/browse/HMSP-1683
  BASE_URI_V2 + "/emails/batch", [email], function (result) {
    return Object.keys(result).reduce(function (acc, vid) {
      return acc.set(vid, ContactRecord.fromJS(result[vid]));
    }, ImmutableMap());
  });
}
export function updateContactProperties(contact, updates) {
  var vid = contact.get('vid');
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI,
      'X-Properties-Flag': 'FORCE_LIFECYCLE_STAGE'
    },
    type: POST
  }, BASE_URI + "/vid/" + contact.get('vid') + "/profile", {
    vid: vid,
    properties: updates.reduce(function (acc, value, property) {
      acc.push({
        property: property,
        value: value,
        source: CRM_UI
      });
      return acc;
    }, [])
  });
}
export function promoteEmailToPrimary(vid, email) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: POST
  }, CONTACT_EMAIL + "/" + vid + "/secondary-email/" + encodeURIComponent(email) + "/promote");
}
export function addSecondaryEmail(vid, email) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: POST
  }, CONTACT_EMAIL + "/" + vid + "/secondary-email/" + encodeURIComponent(email));
}
export function deleteSecondaryEmail(vid, email) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: DELETE
  }, CONTACT_EMAIL + "/" + vid + "/secondary-email/" + encodeURIComponent(email));
}
export function updateSecondaryEmail(vid, prevEmail, nextEmail) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: PUT
  }, CONTACT_EMAIL + "/" + vid + "/secondary-email/" + encodeURIComponent(prevEmail) + "/" + encodeURIComponent(nextEmail));
}
export function removeEmail(vid, email) {
  return send({
    headers: {
      'X-Properties-Source': CONTACTS,
      'X-Properties-SourceId': CRM_UI
    },
    type: DELETE
  }, CONTACT_EMAIL + "/" + vid + "/secondary-email/" + encodeURIComponent(email));
}
export function fetchById(id) {
  return getParamOptions().then(function (options) {
    return send({
      headers: {
        'X-Properties-Source': CONTACTS,
        'X-Properties-SourceId': CRM_UI
      },
      type: GET
    }, BASE_URI_V3 + "/" + id, getQueryParams(options), function (result) {
      return ContactRecord.fromJS(result);
    }).catch(function (error) {
      if (error.status === 404) {
        return EMPTY;
      }

      throw error;
    });
  });
}