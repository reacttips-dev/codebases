'use es6';

import { createSelector } from 'reselect';
import { getIsUngatedForManageBeta } from '../redux/selectors/gates';
export var makeGetManagePath = createSelector([getIsUngatedForManageBeta], function (isUngatedForManageBeta) {
  return function (statusType, broadcastGuid) {
    var path = isUngatedForManageBeta ? '/manage' : '/publishing';

    if (isUngatedForManageBeta) {
      if (statusType && statusType !== 'published') {
        path = path + "/" + statusType;
      }

      if (broadcastGuid) {
        path = path + "?broadcast=" + broadcastGuid;
      }
    } else {
      if (statusType) {
        path = path + "/" + statusType;
      }

      if (broadcastGuid) {
        path = path + "/view/" + broadcastGuid;
      }
    }

    return path;
  };
});