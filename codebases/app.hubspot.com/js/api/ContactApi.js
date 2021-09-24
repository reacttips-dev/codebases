'use es6';

import { Map as ImmutableMap, fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
import { MISSING_EMAIL, INVALID_EMAIL, SALES_SUBSCRIPTION, ACTIVE_ENROLLMENTS } from 'SequencesUI/constants/EligibilityConstants';
import { contactsSearchRequest } from 'SequencesUI/api/ElasticSearchApi';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import pluck from 'transmute/pluck';

function fetchEligibilityBatch(vids) {
  if (!vids.size) return Promise.resolve(ImmutableMap());
  return apiClient.post('sequences/v2/eligibility/batch', {
    data: {
      vids: vids,
      validations: [SALES_SUBSCRIPTION, ACTIVE_ENROLLMENTS]
    }
  }).then(function (res) {
    return res.sequenceEnrollmentEligibilityByVid;
  }).then(fromJS);
}

export function searchContacts(query) {
  var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return contactsSearchRequest(query, queryParams).then(function (contactSearchResults) {
    var sortedContacts = contactSearchResults.get('_results').groupBy(function (contact) {
      return getProperty(contact, 'email') ? 'hasEmail' : 'missingEmail';
    });
    var resultsForContactsWithoutEmail = sortedContacts.get('missingEmail', ImmutableMap()).reduce(function (acc, result) {
      return acc.set("" + result.get('vid'), ImmutableMap({
        errorType: INVALID_EMAIL,
        metadata: ImmutableMap({
          activeEnrollment: null,
          salesSubscriptionStatus: MISSING_EMAIL
        })
      }));
    }, ImmutableMap());
    var contactsWithEmail = sortedContacts.get('hasEmail', ImmutableMap());
    return fetchEligibilityBatch(pluck('vid', contactsWithEmail)).then(function (eligibilityResults) {
      return contactSearchResults.set('eligibilityResults', eligibilityResults.merge(resultsForContactsWithoutEmail));
    });
  });
}
export function searchCommunicateContacts(query) {
  return searchContacts(query, {
    requestAction: 'COMMUNICATE'
  });
}
export function fetchContacts(vids) {
  return apiClient.get('contacts/v1/contact/vids/batch', {
    query: {
      vid: vids
    }
  });
}