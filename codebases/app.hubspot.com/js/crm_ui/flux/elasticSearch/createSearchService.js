'use es6';

import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { Record, Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import registerService from 'crm_data/flux/registerService';
export default function (namespace, actionTypes, searchAPI) {
  var QUEUED = actionTypes.QUEUED,
      SUCCEEDED = actionTypes.SUCCEEDED,
      FAILED = actionTypes.FAILED,
      SETTLED = actionTypes.SETTLED;
  var ServiceState = Record({
    pending: ImmutableMap()
  }, namespace + "SearchServiceState");
  var handlers = {};

  handlers[QUEUED] = function (state, _ref) {
    var lookupKey = _ref.lookupKey,
        searchQuery = _ref.searchQuery,
        viewId = _ref.viewId,
        options = _ref.options;
    var key = viewId + "-" + lookupKey;

    if (!state.pending.get(key)) {
      state = state.setIn(['pending', key], ImmutableSet());
    }

    if (state.pending.get(key).has(searchQuery)) {
      return state;
    }

    searchAPI.search(searchQuery, lookupKey).then(function (results) {
      dispatchImmediate(SUCCEEDED, {
        lookupKey: lookupKey,
        searchQuery: searchQuery,
        results: results,
        viewId: viewId,
        options: options
      });
      return dispatchQueue(SETTLED, {
        key: key,
        searchQuery: searchQuery,
        options: options
      }).done();
    }, function (error) {
      dispatchImmediate(FAILED, {
        lookupKey: lookupKey,
        searchQuery: searchQuery,
        viewId: viewId,
        error: error
      });
      return dispatchQueue(SETTLED, {
        key: key,
        searchQuery: searchQuery,
        options: options
      }).done();
    }).catch(function (error) {
      dispatchImmediate(FAILED, {
        lookupKey: lookupKey,
        searchQuery: searchQuery,
        viewId: viewId,
        error: error
      });
      return dispatchQueue(SETTLED, {
        key: key,
        searchQuery: searchQuery,
        options: options
      }).done();
    }).done();
    return state.updateIn(['pending', key], function (val) {
      return val.add(searchQuery);
    });
  };

  handlers[SETTLED] = function (state, _ref2) {
    var key = _ref2.key,
        searchQuery = _ref2.searchQuery;
    return state.updateIn(['pending', key], function (val) {
      return val.delete(searchQuery);
    });
  };

  return registerService(ServiceState(), handlers);
}