'use es6';

import Immutable, { Map as ImmutableMap } from 'immutable';
import { defineFactory } from 'general-store';
import dispatcher from 'dispatcher/dispatcher';
import { ES_FETCH_QUEUED, ES_FETCH_SUCCEEDED, ES_FETCH_FAILED, ES_DATA_UPDATED, ES_RESULT_MOVED, ES_VIEW_UPDATED, ES_CLEAR_KEY_DATA } from 'crm_data/actions/ActionTypes';
import { dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { elasticSearchApiInfo } from './api/ElasticSearchAPIInfo';
import { isOfMinSearchLength } from './ElasticSearchValidation';
import './ElasticSearchService';
var MIN_CACHE = 1000;

var trimQuery = function trimQuery(_ref) {
  var searchQuery = _ref.searchQuery,
      overrideMinimumSearch = _ref.overrideMinimumSearch;
  var query = searchQuery.get('query');

  if (!isOfMinSearchLength(query) && !overrideMinimumSearch) {
    searchQuery = searchQuery.set('query', '');
  }

  return searchQuery;
};

var getPagesKey = function getPagesKey(objectType, searchQuery) {
  var filtering = JSON.stringify(ImmutableMap({
    filterGroups: searchQuery.get('filterGroups'),
    sorts: searchQuery.get('sorts'),
    query: searchQuery.get('query')
  }));
  return [objectType, filtering];
};

export var getKey = function getKey(objectType, searchQuery) {
  var paging = JSON.stringify(ImmutableMap({
    offset: searchQuery.get('offset'),
    count: searchQuery.get('count')
  }));
  var propertiesFromQuery = searchQuery.getIn(['requestOptions', 'properties']) || searchQuery.get('properties') || [];
  var properties = JSON.stringify(propertiesFromQuery.sort());
  return [].concat(getPagesKey(objectType, searchQuery), paging + "-" + properties);
};

var getViewKey = function getViewKey(objectType, viewId) {
  return [objectType, 'views', viewId];
};

var isExpired = function isExpired(results, _ref2) {
  var cacheTimeout = _ref2.cacheTimeout;

  if (cacheTimeout === false) {
    return false;
  }

  if (cacheTimeout == null) {
    cacheTimeout = MIN_CACHE;
  }

  if (cacheTimeout < MIN_CACHE) {
    cacheTimeout = MIN_CACHE;
  }

  var fetchTime = results.get('fetchTime');
  return fetchTime + cacheTimeout <= Date.now();
};

var insertId = function insertId(results, dataKey, id, toIndex) {
  var ids = results.get(dataKey);
  var index = ids.indexOf(id);

  if (index === -1) {
    ids = ids.insert(toIndex, id);
    results = results.set(dataKey, ids).set('_results', ids).set('total', results.get('total') + 1);
  }

  return results;
};

var removeId = function removeId(results, dataKey, id) {
  var ids = results.get(dataKey);
  var index = ids.indexOf(id);

  if (index !== -1) {
    ids = ids.delete(index);
    results = results.set(dataKey, ids).set('_results', ids).set('total', results.get('total') - 1);
  }

  return results;
};

export default defineFactory().defineName('ElasticSearchStore').defineGetInitialState(ImmutableMap).defineGet(function (state, _ref3) {
  var objectType = _ref3.objectType,
      searchQuery = _ref3.searchQuery,
      viewId = _ref3.viewId,
      _ref3$options = _ref3.options,
      options = _ref3$options === void 0 ? {} : _ref3$options,
      _ref3$overrideMinimum = _ref3.overrideMinimumSearch,
      overrideMinimumSearch = _ref3$overrideMinimum === void 0 ? false : _ref3$overrideMinimum;
  var forceFetch = options.forceFetch,
      forceFetchIfExists = options.forceFetchIfExists;

  if (!objectType) {
    return undefined;
  }

  var viewKey = getViewKey(objectType, viewId);

  if (searchQuery) {
    searchQuery = trimQuery({
      searchQuery: searchQuery,
      overrideMinimumSearch: overrideMinimumSearch
    });
    var key = getKey(objectType, searchQuery);
    var results = state.getIn(key);

    if (!results || isExpired(results, options) || forceFetch || forceFetchIfExists && results) {
      dispatchQueue(ES_FETCH_QUEUED, {
        objectType: objectType,
        searchQuery: searchQuery,
        options: options,
        viewId: viewId
      }).done();
    } else if (results && viewId) {
      var currentSearchQuery = state.getIn(viewKey.concat(['searchQuery']));
      var currentResults = state.getIn(getViewKey(objectType, viewId));

      if (!Immutable.is(currentSearchQuery, searchQuery) && currentResults !== results) {
        dispatchQueue(ES_VIEW_UPDATED, {
          objectType: objectType,
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
}).defineResponseTo(ES_FETCH_FAILED, function (state, _ref4) {
  var objectType = _ref4.objectType,
      searchQuery = _ref4.searchQuery,
      viewId = _ref4.viewId,
      error = _ref4.error;
  var key = getKey(objectType, searchQuery);

  if (!state.hasIn(key)) {
    var results = ImmutableMap().merge({
      searchQuery: searchQuery,
      fetchTime: Date.now(),
      error: error
    });
    state = state.setIn(key, results);

    if (viewId) {
      state = state.setIn(getViewKey(objectType, viewId), results);
    }
  }

  return state;
}).defineResponseTo([ES_FETCH_SUCCEEDED, ES_DATA_UPDATED], function (state, _ref5) {
  var objectType = _ref5.objectType,
      searchQuery = _ref5.searchQuery,
      viewId = _ref5.viewId,
      results = _ref5.results,
      _ref5$options = _ref5.options,
      options = _ref5$options === void 0 ? {} : _ref5$options;
  var key = getKey(objectType, searchQuery);
  results = results.merge({
    searchQuery: searchQuery,
    fetchTime: Date.now()
  });

  if (options.clearPages) {
    state = state.deleteIn(getPagesKey(objectType, searchQuery));
  }

  if (viewId) {
    state = state.setIn(getViewKey(objectType, viewId), results);
  }

  return state.setIn(key, results);
}).defineResponseTo(ES_VIEW_UPDATED, function (state, _ref6) {
  var objectType = _ref6.objectType,
      viewId = _ref6.viewId,
      results = _ref6.results;

  if (viewId) {
    state = state.setIn(getViewKey(objectType, viewId), results);
  }

  return state;
}).defineResponseTo(ES_RESULT_MOVED, function (state, _ref7) {
  var objectType = _ref7.objectType,
      fromSearchQuery = _ref7.fromSearchQuery,
      fromViewId = _ref7.fromViewId,
      toSearchQuery = _ref7.toSearchQuery,
      toViewId = _ref7.toViewId,
      _ref7$toIndex = _ref7.toIndex,
      toIndex = _ref7$toIndex === void 0 ? 0 : _ref7$toIndex,
      id = _ref7.id;

  var _elasticSearchApiInfo = elasticSearchApiInfo(objectType),
      dataKey = _elasticSearchApiInfo.dataKey;

  var fromKey = getPagesKey(objectType, fromSearchQuery);
  var fromPages = state.getIn(fromKey);

  if (fromPages) {
    fromPages = fromPages.map(function (results) {
      return removeId(results, dataKey, id);
    });
    state = state.setIn(fromKey, fromPages);
  }

  var toKey = getPagesKey(objectType, toSearchQuery);
  var toPages = state.getIn(toKey);

  if (toPages) {
    toPages = toPages.map(function (results) {
      return insertId(results, dataKey, id, toIndex);
    });
    state = state.setIn(toKey, toPages);
  }

  var fromViewKey = getViewKey(objectType, fromViewId);
  var fromViewResults = state.getIn(fromViewKey);

  if (fromViewResults) {
    state = state.setIn(fromViewKey, removeId(fromViewResults, dataKey, id));
  }

  var toViewKey = getViewKey(objectType, toViewId);
  var toViewResults = state.getIn(toViewKey);

  if (toViewResults) {
    state = state.setIn(toViewKey, insertId(toViewResults, dataKey, id, toIndex));
  }

  return state;
}).defineResponseTo(ES_CLEAR_KEY_DATA, function (state, _ref8) {
  var key = _ref8.key;
  var prevValue = state.getIn(key);

  if (prevValue) {
    state = state.setIn(key, undefined);
  }

  return state;
}).register(dispatcher);