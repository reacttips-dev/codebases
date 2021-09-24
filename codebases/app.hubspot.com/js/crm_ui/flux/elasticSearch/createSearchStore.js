'use es6';

import createSearchService from './createSearchService';
import * as Dispatch from 'crm_data/dispatch/Dispatch';
import { defineFactory } from 'general-store';
import Immutable, { Map as ImmutableMap } from 'immutable';
import { isOfMinSearchLength } from 'customer-data-objects/search/ElasticSearchQuery';

var _trimQuery = function _trimQuery(searchQuery) {
  var query = searchQuery.get('query');

  if (!query || !isOfMinSearchLength(query)) {
    searchQuery = searchQuery.set('query', '');
  }

  return searchQuery;
};

var _getKey = function _getKey(lookupKey, searchQuery) {
  return [lookupKey, _trimQuery(searchQuery)];
};

var _getViewKey = function _getViewKey(viewId, lookupKey) {
  return ['views', viewId, lookupKey];
};

export default function (namespace, actionTypes, api) {
  var QUEUED = actionTypes.QUEUED,
      SUCCEEDED = actionTypes.SUCCEEDED,
      FAILED = actionTypes.FAILED,
      EXPIRED = actionTypes.EXPIRED,
      VIEW_UPDATED = actionTypes.VIEW_UPDATED;
  createSearchService(namespace, actionTypes, api);
  var _isExpired = false;
  var SearchStore = defineFactory().defineName(namespace + "_createSearchStore").defineGetInitialState(ImmutableMap).defineGet(function (state, _ref) {
    var lookupKey = _ref.lookupKey,
        searchQuery = _ref.searchQuery,
        viewId = _ref.viewId,
        options = _ref.options;

    if (options == null) {
      options = {};
    }

    var _options = options,
        forceFetchIfExists = _options.forceFetchIfExists;

    if (!lookupKey) {
      return undefined;
    }

    var viewKey = _getViewKey(viewId, lookupKey);

    if (searchQuery) {
      var key = _getKey(lookupKey, searchQuery);

      var results = state.getIn(key);

      if (!results || forceFetchIfExists && results || _isExpired) {
        _isExpired = false;
        Dispatch.dispatchQueue(QUEUED, {
          lookupKey: lookupKey,
          searchQuery: searchQuery,
          options: options,
          viewId: viewId
        }).done();
      } else if (results && viewId && !state.getIn(viewKey.concat(['error']))) {
        if (!Immutable.is(state.getIn(viewKey.concat(['searchQuery'])), searchQuery)) {
          Dispatch.dispatchQueue(VIEW_UPDATED, {
            lookupKey: lookupKey,
            viewId: viewId,
            results: results
          }).done();
        }
      }

      if (results) {
        return results;
      }
    } else if (viewId) {
      return state.getIn(viewKey);
    }

    return undefined;
  }).defineResponseTo(EXPIRED, function (state) {
    _isExpired = true;
    return state;
  }).defineResponseTo(SUCCEEDED, function (state, _ref2) {
    var lookupKey = _ref2.lookupKey,
        searchQuery = _ref2.searchQuery,
        results = _ref2.results,
        viewId = _ref2.viewId;

    var key = _getKey(lookupKey, searchQuery);

    results = results.merge({
      searchQuery: searchQuery,
      fetchTime: Date.now()
    });

    if (viewId) {
      state = state.setIn(_getViewKey(viewId, lookupKey), results);
    }

    return state.setIn(key, results);
  }).defineResponseTo(FAILED, function (state, _ref3) {
    var lookupKey = _ref3.lookupKey,
        searchQuery = _ref3.searchQuery,
        error = _ref3.error;

    var key = _getKey(lookupKey, searchQuery);

    return state.setIn(key, ImmutableMap({
      error: error
    }));
  }).defineResponseTo(VIEW_UPDATED, function (state, _ref4) {
    var viewId = _ref4.viewId,
        lookupKey = _ref4.lookupKey,
        results = _ref4.results;

    if (viewId) {
      var viewKey = _getViewKey(viewId, lookupKey);

      state = state.setIn(viewKey, results);
    }

    return state;
  });
  SearchStore.getKey = _getKey;
  SearchStore.getViewKey = _getViewKey;
  return SearchStore;
}