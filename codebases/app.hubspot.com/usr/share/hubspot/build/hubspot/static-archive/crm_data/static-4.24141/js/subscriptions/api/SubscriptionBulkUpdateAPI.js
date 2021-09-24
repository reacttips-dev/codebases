'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
var BULK_SUBSCRIPTION_ENDPOINT = 'subscriptions/v1/bulk-update-resource';
export var performBulkUpdateSubscriptions = function performBulkUpdateSubscriptions(data) {
  return ImmutableAPI.send({
    type: 'POST',
    dataType: 'text'
  }, BULK_SUBSCRIPTION_ENDPOINT, data);
};