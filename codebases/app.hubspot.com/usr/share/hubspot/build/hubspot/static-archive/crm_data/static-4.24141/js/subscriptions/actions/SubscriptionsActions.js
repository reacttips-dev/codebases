'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import I18n from 'I18n';
import { Map as ImmutableMap, List } from 'immutable';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
import * as SubscriptionsAPI from 'crm_data/subscriptions/api/SubscriptionsByEmailAPI';
import * as UpdatedSubscriptionStatusAPI from 'crm_data/subscriptions/api/UpdatedSubscriptionStatusAPI';
import * as UpdatedSubscriptionHistoryAPI from 'crm_data/subscriptions/api/UpdatedSubscriptionHistoryAPI';
import { performApplySubscriptionByKey } from 'crm_data/subscriptions/api/SubscriptionDefinitionsAPI';
import { performBulkUpdateSubscriptions } from 'crm_data/subscriptions/api/SubscriptionBulkUpdateAPI';
import { SUBSCRIPTION_RELATIONSHIP_FETCH_SUCCEEDED, SUBSCRIPTION_RELATIONSHIP_UPDATE_SUCCEEDED, SUBSCRIPTION_RELATIONSHIP_UPDATES_SUCCEEDED, UPDATED_SUBSCRIPTION_HISTORY_UPDATED, UPDATED_SUBSCRIPTION_STATUS_REFRESH_QUEUED, UPDATED_SUBSCRIPTION_HISTORY_REFRESH_QUEUED } from 'crm_data/actions/ActionTypes';
import { NOT_OPTED, OPT_IN } from 'customer-data-email/schema/gdpr/OptStatusConstants';
import { SOURCE_HUBSPOT_CUSTOMER, getSecondaryEmailsFromSubject } from 'crm_data/constants/SubscriptionConstants';
import PortalIdParser from 'PortalIdParser';
import allSettled from 'hs-promise-utils/allSettled';
import ContactsStore from 'crm_data/contacts/ContactsStore';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
export function refreshSubscriptionStatuses(subjectId) {
  var subject = ContactsStore.get(subjectId); // Refresh primary email statuses.

  var primaryEmail = getProperty(subject, 'email');
  dispatchImmediate(UPDATED_SUBSCRIPTION_STATUS_REFRESH_QUEUED, List([primaryEmail]));
  dispatchImmediate(UPDATED_SUBSCRIPTION_HISTORY_REFRESH_QUEUED, List([primaryEmail])); // Refresh secondary email statuses.

  var secondaryEmails = getSecondaryEmailsFromSubject(subject);
  secondaryEmails.forEach(function (secondaryEmail) {
    dispatchImmediate(UPDATED_SUBSCRIPTION_STATUS_REFRESH_QUEUED, List(secondaryEmail));
    dispatchImmediate(UPDATED_SUBSCRIPTION_HISTORY_REFRESH_QUEUED, List(secondaryEmail));
  });
}
export function getSubscriptions(email) {
  return SubscriptionsAPI.fetchSubscriptions(email).then(function (data) {
    dispatchImmediate(SUBSCRIPTION_RELATIONSHIP_FETCH_SUCCEEDED, data);
  });
}
export function optInSubscription(email, _ref) {
  var lawfulBasis = _ref.lawfulBasis,
      subscription = _ref.subscription,
      explanation = _ref.explanation;
  var updatedSubscription = {
    id: subscription,
    optState: 'OPT_IN',
    subscribed: true,
    unsubscribed: false,
    legalBasis: lawfulBasis,
    legalBasisExplanation: explanation
  };
  var body = {
    subscriptionStatuses: [updatedSubscription],
    email: email,
    portalId: PortalIdParser.get()
  };
  return SubscriptionsAPI.updateSubscription(email, body).then(function () {
    dispatchImmediate(SUBSCRIPTION_RELATIONSHIP_UPDATE_SUCCEEDED, {
      updatedSubscription: updatedSubscription,
      email: email
    });
  });
}
export function updateSubscription(email, _ref2) {
  var lawfulBasis = _ref2.lawfulBasis,
      subscriptionId = _ref2.subscriptionId,
      explanation = _ref2.explanation,
      optState = _ref2.optState;
  var updatedSubscription = {
    subscriptionId: subscriptionId,
    optState: optState,
    legalBasis: lawfulBasis,
    legalBasisExplanation: explanation,
    timestamp: I18n.moment.now().valueOf(),
    source: SOURCE_HUBSPOT_CUSTOMER,
    updateCause: 'UPDATED_VIA_HUBSPOT_CUSTOMER',
    sourceType: 'API',
    portalId: PortalIdParser.get()
  };
  return UpdatedSubscriptionStatusAPI.updateSubscription(email, updatedSubscription).then(function () {
    dispatchImmediate(SUBSCRIPTION_RELATIONSHIP_UPDATE_SUCCEEDED, {
      updatedSubscription: updatedSubscription,
      email: email
    });
    return UpdatedSubscriptionHistoryAPI.fetchSubscriptionsHistory(email).then(function (history) {
      dispatchImmediate(UPDATED_SUBSCRIPTION_HISTORY_UPDATED, ImmutableMap(_defineProperty({}, email, history)));
    });
  });
}
export function optInSubscriptions(emails, _ref3) {
  var lawfulBasis = _ref3.lawfulBasis,
      subscription = _ref3.subscription,
      explanation = _ref3.explanation;
  var updatedSubscription = {
    id: subscription,
    legalBasis: lawfulBasis,
    legalBasisExplanation: explanation
  };
  var updatePromises = emails.map(function () {
    var optState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NOT_OPTED;
    var email = arguments.length > 1 ? arguments[1] : undefined;
    updatedSubscription.optState = optState;
    updatedSubscription.subscribed = optState === OPT_IN;
    updatedSubscription.unsubscribed = optState !== OPT_IN;
    var body = {
      subscriptionStatuses: [updatedSubscription],
      email: email,
      portalId: PortalIdParser.get()
    };
    return SubscriptionsAPI.updateSubscription(email, body);
  });
  return allSettled(updatePromises).then(function () {
    dispatchImmediate(SUBSCRIPTION_RELATIONSHIP_UPDATES_SUCCEEDED, {
      emails: emails,
      updatedSubscription: updatedSubscription
    });
  });
}
export function optOutSubscription(email, _ref4) {
  var lawfulBasis = _ref4.lawfulBasis,
      subscription = _ref4.subscription,
      explanation = _ref4.explanation;
  var updatedSubscription = {
    id: subscription,
    optState: 'OPT_OUT',
    subscribed: false,
    unsubscribed: true,
    legalBasis: lawfulBasis,
    legalBasisExplanation: explanation
  };
  var body = {
    subscriptionStatuses: [updatedSubscription],
    email: email,
    portalId: PortalIdParser.get()
  };
  return SubscriptionsAPI.updateSubscription(email, body).then(function () {
    dispatchImmediate(SUBSCRIPTION_RELATIONSHIP_UPDATE_SUCCEEDED, {
      updatedSubscription: updatedSubscription,
      email: email
    });
  });
}
export function bulkUpdateSubscriptions(body) {
  return performBulkUpdateSubscriptions(body);
}
export function applySubscriptionByKey(subscription_type) {
  return performApplySubscriptionByKey(subscription_type, PortalIdParser.get());
}