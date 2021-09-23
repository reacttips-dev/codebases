'use es6';

import { EMPTY } from 'crm_data/flux/LoadingStatus';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import keyMirror from 'react-utils/keyMirror';
import { List } from 'immutable';
export var SOURCE_HUBSPOT_CUSTOMER = 'SOURCE_HUBSPOT_CUSTOMER';
export var SOURCE_BULK_ACTION = 'Bulk Subscription Update';
export var OPT_STATES = keyMirror({
  OPT_OUT: null,
  NOT_OPTED: null,
  OPT_IN: null
});
export var isPortalWideOptedOut = function isPortalWideOptedOut(portalWideStatus) {
  return portalWideStatus && portalWideStatus.get('portalWide') && portalWideStatus.get('optState') === OPT_STATES.OPT_OUT;
};
export var getSecondaryEmailsFromSubject = function getSecondaryEmailsFromSubject(subject) {
  if (!subject) {
    return EMPTY;
  }

  return getProperty(subject, 'hs_additional_emails') && getProperty(subject, 'hs_additional_emails').split(';') || [];
};
export var isUnsubscribedFromAll = function isUnsubscribedFromAll(subscriptions) {
  if (!subscriptions || subscriptions.isEmpty()) {
    return false;
  }

  return subscriptions.every(function (sub) {
    return sub.isUnsubscribed();
  });
};
export var ONE_TO_ONE_DEFAULT_TYPE = 'ONE_TO_ONE';
export var getAggregateKey = function getAggregateKey(baseKey, subscribedCount, unsubscribedCount, notSubscribedCount) {
  var withDescriptor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  var aggregateKey = baseKey;
  var descriptorKey = withDescriptor ? 'WithDescriptor' : '';

  if (subscribedCount > 0) {
    return baseKey + "Subscribed" + descriptorKey;
  } else if (unsubscribedCount > 0) {
    aggregateKey = baseKey + "Unsubscribed" + descriptorKey;

    if (unsubscribedCount === 1 && notSubscribedCount === 1) {
      return aggregateKey + ".bothSingle";
    } else if (unsubscribedCount > 1 && notSubscribedCount === 1) {
      return aggregateKey + ".singleNotSpecified";
    } else if (unsubscribedCount === 1 && notSubscribedCount > 1) {
      return aggregateKey + ".singleUnsubscribed";
    } else {
      return aggregateKey + ".bothMultiple";
    }
  } else {
    return baseKey + "NotSpecified" + descriptorKey;
  }
};
export function getSubscriptionCounts(subscriptions, isGdprComplianceEnabled) {
  if (!subscriptions) {
    return {
      subscribedCount: 0,
      unsubscribedCount: 0,
      notSubscribedCount: 0
    };
  }

  if (List.isList(subscriptions)) {
    subscriptions = subscriptions.toArray();
  }

  var subscribedCount = subscriptions.filter(function (sub) {
    return sub.canCommunicate(isGdprComplianceEnabled);
  }).length;
  var unsubscribedCount = subscriptions.filter(function (sub) {
    return sub.isUnsubscribed();
  }).length;
  var notSubscribedCount = subscriptions.filter(function (sub) {
    return sub.isNotSpecified();
  }).length;
  return {
    subscribedCount: subscribedCount,
    unsubscribedCount: unsubscribedCount,
    notSubscribedCount: notSubscribedCount
  };
}