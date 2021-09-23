'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { OWNERS_FETCH_SUCCEEDED } from '../actions/ActionTypes';
import { dispatchImmediate } from 'crm_data/dispatch/Dispatch';
import { getId } from 'customer-data-objects/protocol/Identifiable';
import { Map as ImmutableMap } from 'immutable';
import isNumber from 'transmute/isNumber';
import { getFrom, setFrom } from 'crm_data/settings/LocalSettings';
import { fetchCurrentOwner } from './OwnersAPI';
import PortalIdParser from 'PortalIdParser';
import userInfo from 'hub-http/userInfo';
export function fetchCurrentOwnerIdFromCache() {
  return userInfo().then(function (info) {
    var key = "OID:" + info.user.user_id + ":" + PortalIdParser.get();
    var cachedId = getFrom(localStorage, key);

    if (isNumber(cachedId) && cachedId > 0) {
      return Promise.resolve(cachedId);
    }

    return fetchCurrentOwner().then(function (owner) {
      if (!owner) {
        dispatchImmediate(OWNERS_FETCH_SUCCEEDED, ImmutableMap({
          '-1': null
        }));
        return -1;
      }

      var ownerId = getId(owner);
      setFrom(localStorage, key, ownerId);
      dispatchImmediate(OWNERS_FETCH_SUCCEEDED, ImmutableMap(_defineProperty({}, ownerId, owner)));
      return ownerId;
    });
  });
}