'use es6';

import { createSelector } from 'reselect';
import * as ReadOnlyReason from '../enums/ReadOnlyReason';
import { getHasFileManagerWriteScope } from './Auth';
import { getIsPortalSuspended, getSuspensionFetchStatus } from './Suspension';
import { RequestStatus } from '../Constants';
export var getReadOnlyReason = createSelector([getSuspensionFetchStatus, getIsPortalSuspended, getHasFileManagerWriteScope], function (fetchStatus, isSuspended, hasWriteScope) {
  if (!hasWriteScope) {
    if (fetchStatus === RequestStatus.SUCCEEDED && isSuspended) {
      return ReadOnlyReason.PORTAL_SUSPENDED;
    }

    return ReadOnlyReason.USER_WRITE_PERMISSION;
  }

  return null;
});
export var getIsReadOnly = createSelector([getReadOnlyReason], function (readOnlyReason) {
  return Boolean(readOnlyReason);
});
export var getIsReadOnlySuspended = createSelector([getReadOnlyReason], function (readOnlyReason) {
  return readOnlyReason === ReadOnlyReason.PORTAL_SUSPENDED;
});