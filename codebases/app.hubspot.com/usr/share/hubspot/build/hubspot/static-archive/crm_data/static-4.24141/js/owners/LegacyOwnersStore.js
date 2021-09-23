'use es6';

import LegacyActiveOwnerIdsStore from './LegacyActiveOwnerIdsStore';
import dispatcher from 'dispatcher/dispatcher';
import { InspectStore, defineFactory } from 'general-store';
import identity from 'transmute/identity';
import get from 'transmute/get';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { isLoading, LOADING, isResolved } from 'crm_data/flux/LoadingStatus';
import OwnerIdsByEmailStore from './OwnerIdsByEmailStore';
import OwnersStore from './OwnersStore';
import { dispatchQueue, dispatchImmediate } from '../dispatch/Dispatch';
import { LEGACY_OWNERS_FETCH_STARTED, LEGACY_OWNERS_FETCH_SUCCEEDED, LEGACY_OWNERS_UPDATED, LEGACY_OWNERS_FETCH_QUEUED, LEGACY_OWNERS_FETCH_FAILED } from 'crm_data/actions/ActionTypes';
import { fetchAll } from './OwnersAPI';
import { indexByIdString } from 'customer-data-objects/protocol/Identifiable';

var maybeFetchMore = function maybeFetchMore(state, data) {
  if (data && data.hasMore) {
    fetchAll(data.offset, true).then(function (response) {
      var owners = data.owners.concat(response.owners);
      var updates = Object.assign({}, response, {
        owners: owners
      });
      dispatchQueue(LEGACY_OWNERS_UPDATED, updates);
    }).done();
  }

  return state.set('owners', get('owners', data));
};

var shouldUsePagedEndpoint = function shouldUsePagedEndpoint(options) {
  return options && options.usePaged;
};

var legacyOwnerFetch = function legacyOwnerFetch() {
  var ownerIds = LegacyActiveOwnerIdsStore.get();

  if (!isResolved(ownerIds)) {
    return ImmutableMap();
  }

  var activeOwners = OwnersStore.get(ownerIds);

  if (activeOwners.some(isLoading)) {
    return ImmutableMap();
  }

  return activeOwners;
};

export default defineFactory().defineName('LegacyOwnersStore').defineGetInitialState(function () {
  return ImmutableMap({
    promise: null,
    owners: LOADING
  });
}).defineGet(function (state, options) {
  if (shouldUsePagedEndpoint(options)) {
    if (!state.get('promise')) {
      dispatchQueue(LEGACY_OWNERS_FETCH_QUEUED);
    }

    if (!isResolved(state.get('owners'))) {
      return ImmutableMap();
    }

    return indexByIdString(state.get('owners'));
  }

  return legacyOwnerFetch();
}).defineResponseTo(LEGACY_OWNERS_FETCH_QUEUED, function (state) {
  var promise = fetchAll(0, true);
  dispatchQueue(LEGACY_OWNERS_FETCH_STARTED);
  promise.then(function (response) {
    return dispatchImmediate(LEGACY_OWNERS_FETCH_SUCCEEDED, response);
  }, function () {
    return dispatchImmediate(LEGACY_OWNERS_FETCH_FAILED);
  }).done();
  return state.set('promise', promise);
}).defineResponseTo(LEGACY_OWNERS_FETCH_SUCCEEDED, maybeFetchMore).defineResponseTo(LEGACY_OWNERS_UPDATED, maybeFetchMore).defineResponseTo(LEGACY_OWNERS_FETCH_FAILED, function (state) {
  return state.set('promise', null);
}).defineResponseTo( // HACK: makes LegacyOwnersStore respond to all actions of the other owners stores
[LegacyActiveOwnerIdsStore, OwnerIdsByEmailStore, OwnersStore].reduce(function (allActions, store) {
  return allActions.union(InspectStore.getActionTypes(store));
}, ImmutableSet()).toArray(), identity).register(dispatcher);