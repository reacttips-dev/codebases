'use es6';

import { dispatch } from 'crm_data/flux/dispatch';
import { dispatchSafe, dispatchQueue } from 'crm_data/dispatch/Dispatch';
import { getTruncatedQuery } from 'customer-data-objects/search/ElasticSearchQuery';
import { GRID_CHECKED, GRID_ALL_SELECTED, GRID_SEARCH_UPDATED, GRID_SEARCH_QUERY_UPDATED, UPDATE_GRID_SEARCH_QUERIES, GRID_SELECTED_CLEARED, GRID_CLEANUP_SELECTED, GRID_SHOWING_CHANGED, GRID_RESET, GRID_TEMPORARY_INCLUDE_ID, GRID_TEMPORARY_EXCLUDE_IDS, GRID_TEMPORARY_RESET, GRID_TEMPORARY_SET, GRID_SAVED_FILTER_CHANGED } from './GridUIActionTypes';
import debounce from 'transmute/debounce';
import { SEARCH_DEBOUNCE_TIME } from '../../constants/SearchConstants';
import { SEARCH_LENGTH_LIMIT, SEARCH_WORD_LIMIT } from 'customer-data-objects/search/ElasticSearchConstants';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import { CrmLogger } from 'customer-data-tracking/loggers';
import throttle from 'transmute/throttle';

var getAlert = function getAlert(key) {
  var alert = function alert() {
    CrmLogger.log('indexUsage', {
      action: 'use local search',
      subAction: "reached " + (key.match('word') ? 'word' : 'character') + " limit"
    });
    Alerts.addError("elasticSearch." + key, {}, {
      id: key
    });
  };

  return throttle(1000, alert);
};

var alerts = {
  words: getAlert('wordLimit'),
  characters: getAlert('characterLimit')
};
export var isTooLong = function isTooLong() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (!query || typeof query !== 'string') {
    return false;
  }

  var splitQuery = query.split(' ');
  var hasTooManyCharacters = query.length > SEARCH_LENGTH_LIMIT;
  var hasTooManyWords = splitQuery.length > SEARCH_WORD_LIMIT;

  if (hasTooManyCharacters) {
    return {
      type: 'characters',
      limit: SEARCH_LENGTH_LIMIT
    };
  }

  if (hasTooManyWords) {
    return {
      type: 'words',
      limit: SEARCH_WORD_LIMIT
    };
  }

  return false;
};

var displayQueryAlerts = function displayQueryAlerts() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var tooLong = isTooLong(query);

  if (!tooLong) {
    return;
  }

  var type = tooLong.type;
  alerts[type]();
};

export function check(ids, isChecked) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return dispatch(GRID_CHECKED, {
    ids: ids,
    isChecked: isChecked
  });
}
export function selectAll(ids, filters) {
  if (filters.toJS) {
    filters = filters.toJS();
  }

  return dispatchSafe(GRID_ALL_SELECTED, {
    ids: ids,
    filters: filters
  });
}
export function search(_ref) {
  var query = _ref.query,
      objectType = _ref.objectType;
  displayQueryAlerts(query);
  query = getTruncatedQuery(query);
  return dispatchQueue(GRID_SEARCH_UPDATED, {
    query: query,
    objectType: objectType
  });
}
export var searchDebounced = debounce(SEARCH_DEBOUNCE_TIME, search);
export function updateDisplayQuery(_ref2) {
  var displayQuery = _ref2.displayQuery,
      objectType = _ref2.objectType;
  displayQueryAlerts(displayQuery);
  displayQuery = getTruncatedQuery(displayQuery);
  return dispatch(GRID_SEARCH_QUERY_UPDATED, {
    displayQuery: displayQuery,
    objectType: objectType
  });
}
export function setSearchQueries(_ref3) {
  var query = _ref3.query,
      objectTypeId = _ref3.objectTypeId;
  return dispatchQueue(UPDATE_GRID_SEARCH_QUERIES, {
    query: query,
    objectTypeId: objectTypeId
  });
}
export function clearSelected() {
  return dispatchSafe(GRID_SELECTED_CLEARED);
}
export function cleanupSelected(ids) {
  return dispatchSafe(GRID_CLEANUP_SELECTED, ids);
}
export function showingChanged(ids) {
  return dispatch(GRID_SHOWING_CHANGED, {
    ids: ids
  });
}
export function reset(options) {
  return dispatchQueue(GRID_RESET, options);
}
export function temporarilyIncludeId(id) {
  return dispatch(GRID_TEMPORARY_INCLUDE_ID, id);
}
export function temporarilyExcludeIds(ids) {
  return dispatch(GRID_TEMPORARY_EXCLUDE_IDS, ids);
}
export function resetTemporaryIds() {
  return dispatch(GRID_TEMPORARY_RESET);
}
export function setTemporaryIds(ids) {
  return dispatch(GRID_TEMPORARY_SET, ids);
}
export function changeSavedFilter(_ref4) {
  var viewId = _ref4.viewId,
      objectType = _ref4.objectType,
      pageType = _ref4.pageType;
  return dispatchQueue(GRID_SAVED_FILTER_CHANGED, {
    viewId: viewId,
    objectType: objectType,
    pageType: pageType
  });
}
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}