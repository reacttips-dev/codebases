'use es6';

import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
var isUngatedForRestrictedSubscriptionsWrite = {
  stores: [IsUngatedStore],
  deref: function deref() {
    return IsUngatedStore.get('Subscriptions:RestrictContactSubscriptionStatusUpdate');
  }
};
export default isUngatedForRestrictedSubscriptionsWrite;