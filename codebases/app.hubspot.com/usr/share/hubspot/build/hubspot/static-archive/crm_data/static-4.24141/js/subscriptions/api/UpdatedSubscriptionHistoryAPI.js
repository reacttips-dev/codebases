'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';

function getFetchURI(email) {
  return "subscriptions/v1/timeline/email/" + encodeURIComponent(email) + "/full-timeline";
}

export var fetchSubscriptionsHistory = function fetchSubscriptionsHistory(email) {
  return ImmutableAPI.get(getFetchURI(email));
};
export var batchFetchSubscriptionsHistory = makeBatch(fetchSubscriptionsHistory, 'UpdatedSubscriptionHistoryAPI.fetchSubscriptionsHistory');