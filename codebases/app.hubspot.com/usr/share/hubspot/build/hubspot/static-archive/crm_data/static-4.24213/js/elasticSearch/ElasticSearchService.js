'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handlers;

import { Record, Set as ImmutableSet, Map as ImmutableMap } from 'immutable';
import { ES_FETCH_QUEUED, ES_FETCH_SUCCEEDED, ES_FETCH_FAILED, ES_FETCH_SETTLED } from 'crm_data/actions/ActionTypes';
import ObjectTypesRecord from 'crm_data/records/ObjectTypesRecord';
import { dispatchImmediate, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import registerService from 'crm_data/flux/registerService';
import { search } from 'crm_data/elasticSearch/api/ElasticSearchAPI';
var retries = ObjectTypesRecord().reduce(function (map, value, key) {
  return map = map.set(key, ImmutableMap());
}, ImmutableMap());
var EMPTY_STATE = ObjectTypesRecord().reduce(function (map, value, key) {
  return map = map.set(key, ImmutableSet());
}, ImmutableMap());
var ServiceState = Record({
  pending: EMPTY_STATE
}, 'ElasticSearchServiceState');

var getOnSearchResultsFn = function getOnSearchResultsFn(_ref) {
  var objectType = _ref.objectType,
      searchQuery = _ref.searchQuery,
      viewId = _ref.viewId,
      options = _ref.options;
  return function (results) {
    // Check if in a state where lag returns weird results after a delete
    var offset = searchQuery.get('offset');
    var count = searchQuery.get('count');
    var total = results.get('total');
    var returnedResultsSize = results.get('_results').size;
    var retryCount = retries.getIn([objectType, searchQuery], 0);

    if (retryCount < 3 && (count + offset < total && returnedResultsSize < count || total < count && returnedResultsSize < total)) {
      setTimeout(function () {
        dispatchQueue(ES_FETCH_QUEUED, {
          options: options,
          viewId: viewId,
          objectType: objectType,
          searchQuery: searchQuery
        }).done();
      }, retryCount * 1000);
      dispatchImmediate(ES_FETCH_SETTLED, {
        objectType: objectType,
        searchQuery: searchQuery
      });
      retries = retries.setIn([objectType, searchQuery], retryCount + 1);
    } else {
      dispatchImmediate(ES_FETCH_SUCCEEDED, {
        objectType: objectType,
        searchQuery: searchQuery,
        results: results,
        viewId: viewId,
        options: options
      });
      dispatchQueue(ES_FETCH_SETTLED, {
        objectType: objectType,
        searchQuery: searchQuery
      }).done();
      retries = retries.deleteIn([objectType, searchQuery]);
    }
  };
};

var getOnSearchErrorFn = function getOnSearchErrorFn(_ref2) {
  var objectType = _ref2.objectType,
      searchQuery = _ref2.searchQuery;
  return function (error) {
    dispatchImmediate(ES_FETCH_FAILED, {
      objectType: objectType,
      searchQuery: searchQuery,
      error: error
    });
    dispatchQueue(ES_FETCH_SETTLED, {
      objectType: objectType,
      searchQuery: searchQuery
    }).done();
  };
};

var handleFetchQueued = function handleFetchQueued(state, data) {
  var pending = state.pending;
  var objectType = data.objectType,
      searchQuery = data.searchQuery;
  var pendingSearchRequests = pending.get(objectType);

  if (pendingSearchRequests && pendingSearchRequests.has(searchQuery)) {
    return state;
  }

  var processSearchResults = getOnSearchResultsFn(data);
  var processSearchError = getOnSearchErrorFn(data);
  search(objectType, searchQuery).then(processSearchResults, processSearchError).done();
  return pendingSearchRequests ? state.updateIn(['pending', objectType], function (val) {
    return val.add(searchQuery);
  }) : state.setIn(['pending', objectType], ImmutableSet.of(searchQuery));
};

var handleFetchSettled = function handleFetchSettled(state, _ref3) {
  var objectType = _ref3.objectType,
      searchQuery = _ref3.searchQuery;
  return state.updateIn(['pending', objectType], function (val) {
    return val.delete(searchQuery);
  });
};

var handlers = (_handlers = {}, _defineProperty(_handlers, ES_FETCH_QUEUED, handleFetchQueued), _defineProperty(_handlers, ES_FETCH_SETTLED, handleFetchSettled), _handlers);
export default registerService(ServiceState(), handlers);