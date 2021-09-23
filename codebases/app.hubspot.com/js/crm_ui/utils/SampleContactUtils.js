'use es6';

var _this = this;

import { Map as ImmutableMap } from 'immutable';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import CurrentOwnerContainer from '../../containers/CurrentOwnerContainer';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import sampleContacts from '../constants/sampleData/sampleContacts';
import { createContact, updateContactProperties, fetchByEmail } from 'crm_data/contacts/ContactsActions';
import { handleContactExistsError } from '../contacts/ContactsActionsErrorHandlers';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
import { getId, getProperty, setProperty } from 'customer-data-objects/model/ImmutableModel';
import { canEdit } from './SubjectPermissions';
import defer from 'hs-promise-utils/defer';
var BRIAN = sampleContacts.BRIAN,
    COOL_ROBOT = sampleContacts.COOL_ROBOT,
    STEPH = sampleContacts.STEPH,
    MARIA = sampleContacts.MARIA;
var fetchProperties = connectPromiseSingle({
  stores: [PropertiesStore],
  deref: function deref() {
    return PropertiesStore.get(CONTACT);
  }
});
var SAMPLE_CONTACT_EMAILS = [BRIAN.CONTACT_EMAIL, BRIAN.CONTACT_EMAIL_UID, COOL_ROBOT.CONTACT_EMAIL, COOL_ROBOT.CONTACT_EMAIL_UID, MARIA.CONTACT_EMAIL, MARIA.CONTACT_EMAIL_UID, STEPH.CONTACT_EMAIL];
var BRIAN_SAMPLE_CONTACT = ContactRecord.fromJS({
  properties: {
    email: {
      value: BRIAN.CONTACT_EMAIL_UID
    },
    firstname: {
      value: BRIAN.CONTACT_FIRST_NAME
    },
    lastname: {
      value: BRIAN.CONTACT_LAST_NAME
    },
    jobtitle: {
      value: BRIAN.CONTACT_JOBTITLE
    },
    phone: {
      value: BRIAN.CONTACT_PHONE
    },
    hubspot_owner_id: {
      value: CurrentOwnerContainer.get()
    }
  }
});
var MARIA_SAMPLE_CONTACT = ContactRecord.fromJS({
  properties: {
    email: {
      value: MARIA.CONTACT_EMAIL
    },
    firstname: {
      value: MARIA.CONTACT_FIRST_NAME
    },
    lastname: {
      value: MARIA.CONTACT_LAST_NAME
    },
    jobtitle: {
      value: MARIA.CONTACT_JOB_TITLE
    },
    phone: {
      value: MARIA.CONTACT_PHONE
    },
    hubspot_owner_id: {
      value: CurrentOwnerContainer.get()
    }
  }
}); // hs_email_optout might be missing in some cases. This function should
// be removed if hs_email_optout becomes always available.

var _hasOptOutProperty = function _hasOptOutProperty(properties) {
  var property = properties && properties.get('hs_email_optout');

  if (property) {
    return !property.get('readOnlyValue');
  }

  return false;
};

var _fetchSampleContact = function _fetchSampleContact(sampleContact, properties) {
  var deferred = defer();
  var updatedProperties = ImmutableMap();
  fetchByEmail(getProperty(sampleContact, 'email')).then(function (data) {
    var contact = data && data.first();

    if (contact) {
      if (_hasOptOutProperty(properties) && !getProperty(contact, 'hs_email_optout')) {
        updatedProperties = updatedProperties.set('hs_email_optout', true);
      }

      if (!getProperty(contact, 'phone')) {
        updatedProperties = updatedProperties.set('phone', getProperty(sampleContact, 'phone'));
      }

      if (!canEdit(sampleContact)) {
        updatedProperties = updatedProperties.set('hubspot_owner_id', CurrentOwnerContainer.get());
      }

      if (updatedProperties.size > 0) {
        return updateContactProperties(contact, updatedProperties, handleContactExistsError).then(function () {
          return deferred.resolve(getId(contact));
        }, function () {
          return deferred.reject();
        });
      } else {
        return deferred.resolve(getId(contact));
      }
    } else {
      return deferred.reject();
    }
  }, function (e) {
    return deferred.reject(e);
  });
  return deferred.promise;
};

var _createSampleContact = function _createSampleContact(sampleContact, properties) {
  if (_hasOptOutProperty(properties)) {
    sampleContact = setProperty(sampleContact, 'hs_email_optout', true);
  }

  return createContact(sampleContact);
};

export var getOrCreateSampleContact = function getOrCreateSampleContact(sampleContact) {
  sampleContact = sampleContact || MARIA_SAMPLE_CONTACT;
  var deferred = defer();
  fetchProperties().then(function (properties) {
    return _fetchSampleContact(sampleContact, properties).then(function (vid) {
      return deferred.resolve(vid);
    }).catch(function () {
      return _createSampleContact(sampleContact, properties).then(function (contact) {
        return deferred.resolve(getId(contact));
      }).catch(function (err) {
        return deferred.reject(err);
      });
    });
  }).done();
  return deferred.promise;
};
export var createBrian = function createBrian() {
  return _this.getOrCreateSampleContact(BRIAN_SAMPLE_CONTACT);
};
export var getIsSampleContact = function getIsSampleContact(email) {
  return SAMPLE_CONTACT_EMAILS.includes(email);
};