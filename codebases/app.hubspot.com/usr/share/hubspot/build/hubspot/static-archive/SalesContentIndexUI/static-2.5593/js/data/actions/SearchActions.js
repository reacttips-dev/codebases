'use es6';

import quickFetch from 'quick-fetch';
import Raven from 'Raven';
import { List, fromJS } from 'immutable';
import debounce from 'transmute/debounce';
import identity from 'transmute/identity';
import { createAction } from 'flux-actions';
import SearchDebounceDelay from 'SalesContentIndexUI/data/constants/SearchDebounceDelay';
import { SET_SEARCH_QUERY, SET_SORT, SET_SELECTED_FOLDER, SET_VIEW_FILTER, SEARCH_FETCH_SUCCEEDED, FOLDER_FETCH_SUCCEEDED, SEARCH_FETCH_FAILED, SET_FROM_QUERY_PARAMS, SET_FROM_MODAL } from 'SalesContentIndexUI/data/constants/ActionTypes';
import SearchStatus from '../constants/SearchStatus';
import SearchQueryRecord from '../records/SearchQueryRecord';
import filter from '../utils/filter';
import { CONTENT_ID_FIELD, CONTENT_TYPE_FIELD } from '../constants/SearchFields';
import { UserViewFilter } from 'SalesContentIndexUI/data/utils/viewFilters/UserViewFilter';
import { TeamViewFilter } from 'SalesContentIndexUI/data/utils/viewFilters/TeamViewFilter';
import * as FilterTypes from 'SalesContentIndexUI/data/lib/FilterTypes';
var setSearchQueryAction = createAction(SET_SEARCH_QUERY, identity);
var searchFetchSucceededAction = createAction(SEARCH_FETCH_SUCCEEDED, identity);
var folderFetchSucceededAction = createAction(FOLDER_FETCH_SUCCEEDED, identity);
var searchFetchFailedAction = createAction(SEARCH_FETCH_FAILED, identity);
var setSortAction = createAction(SET_SORT, identity);
var setSelectedFolderAction = createAction(SET_SELECTED_FOLDER, identity);
var setViewFilterAction = createAction(SET_VIEW_FILTER, identity);
var setFromQueryParamsAction = createAction(SET_FROM_QUERY_PARAMS, identity);
var setFromModalAction = createAction(SET_FROM_MODAL, identity);

var getSearchQuery = function getSearchQuery(getState) {
  return getState().search.searchQuery;
};

var getSelectedViewFilter = function getSelectedViewFilter(getState) {
  return getState().search.selectedViewFilter;
};

var getMostRecentSort = function getMostRecentSort(getState) {
  return getState().search.mostRecentSort;
};

var getSearchStatus = function getSearchStatus(state) {
  return state.search.searchStatus;
};

var fetchWithEarlyRequestHook = function fetchWithEarlyRequestHook(fallbackFetch, requestName) {
  var earlyRequest = quickFetch.getRequestStateByName(requestName);

  if (earlyRequest) {
    return new Promise(function (resolve, reject) {
      earlyRequest.whenFinished(function (result) {
        resolve(fromJS(result));
      });
      earlyRequest.onError(function (xhrError) {
        Raven.captureMessage('early request failed', {
          extra: {
            responseText: xhrError.responseText,
            status: xhrError.status
          }
        });
        return fallbackFetch().then(function () {
          return resolve.apply(void 0, arguments);
        }, function () {
          return reject.apply(void 0, arguments);
        });
      });
    });
  }

  return fallbackFetch();
};

var getActions = function getActions(_ref) {
  var searchFetch = _ref.searchFetch,
      looseItemContentType = _ref.looseItemContentType,
      folderContentType = _ref.folderContentType,
      defaultViewFilter = _ref.defaultViewFilter,
      searchOptions = _ref.searchOptions;
  var _searchOptions$onSetS = searchOptions.onSetSort,
      onSetSort = _searchOptions$onSetS === void 0 ? identity : _searchOptions$onSetS,
      _searchOptions$onSetV = searchOptions.onSetViewFilter,
      onSetViewFilter = _searchOptions$onSetV === void 0 ? identity : _searchOptions$onSetV,
      _searchOptions$onSetF = searchOptions.onSetFolder,
      onSetFolder = _searchOptions$onSetF === void 0 ? identity : _searchOptions$onSetF,
      _searchOptions$onSear = searchOptions.onSearch,
      onSearch = _searchOptions$onSear === void 0 ? identity : _searchOptions$onSear;

  var search = function search(_ref2) {
    var dispatch = _ref2.dispatch,
        searchQuery = _ref2.searchQuery,
        selectedViewFilter = _ref2.selectedViewFilter,
        isInitial = _ref2.isInitial;
    var searchQueryOverride = selectedViewFilter && selectedViewFilter.getSearchQueryOverride && selectedViewFilter.getSearchQueryOverride({
      searchQuery: searchQuery
    });
    var selectedSearchQuery = searchQueryOverride || searchQuery;

    var fallbackFetch = function fallbackFetch() {
      return searchFetch(selectedSearchQuery);
    };

    var searchPromise = isInitial ? fetchWithEarlyRequestHook(fallbackFetch, 'index-search') : fallbackFetch();
    return searchPromise.then(function (results) {
      return dispatch(searchFetchSucceededAction(results));
    }, function (err) {
      return dispatch(searchFetchFailedAction(err));
    });
  };

  var debouncedSearchFetch = debounce(SearchDebounceDelay, search);

  var fetchSelectedFolder = function fetchSelectedFolder(searchQuery) {
    return function (dispatch) {
      var folderId = searchQuery.getFolderFilter().values.first();

      if (!folderId) {
        return;
      }

      var folderSearchQuery = new SearchQueryRecord({
        limit: 1,
        filters: List([filter(CONTENT_ID_FIELD, folderId), filter(CONTENT_TYPE_FIELD, folderContentType)])
      });
      searchFetch(folderSearchQuery).then(function (res) {
        dispatch(folderFetchSucceededAction(res.get('results').first()));
      });
    };
  };

  return {
    searchFromModal: function searchFromModal(_ref3) {
      var _ref3$isInitial = _ref3.isInitial,
          isInitial = _ref3$isInitial === void 0 ? false : _ref3$isInitial;
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter = getSelectedViewFilter(getState);
        dispatch(setFromModalAction({
          isInitial: isInitial,
          searchQuery: searchQuery
        }));
        search({
          dispatch: dispatch,
          searchQuery: searchQuery,
          selectedViewFilter: selectedViewFilter
        });
      };
    },
    searchFromQueryParams: function searchFromQueryParams(_ref4) {
      var queryParams = _ref4.queryParams,
          _ref4$isInitial = _ref4.isInitial,
          isInitial = _ref4$isInitial === void 0 ? false : _ref4$isInitial,
          _ref4$selectedSort = _ref4.selectedSort,
          selectedSort = _ref4$selectedSort === void 0 ? null : _ref4$selectedSort;
      return function (dispatch, getState) {
        var view = queryParams.view,
            type = queryParams.type;
        var searchQuery = getSearchQuery(getState);
        var selectedFilter;

        if (!type) {
          selectedFilter = getState().viewFilters.get(view);
        } else {
          var ViewFilter = type === FilterTypes.USER ? UserViewFilter : TeamViewFilter;
          selectedFilter = ViewFilter({
            looseItemContentType: looseItemContentType,
            id: view
          });
        }

        var selectedViewFilter = selectedFilter || defaultViewFilter;
        var updatedSearchQuery = searchQuery.mergeWithQueryParams({
          queryParams: queryParams,
          selectedViewFilter: selectedViewFilter
        }).update('sorts', function (sorts) {
          return selectedSort === null ? sorts : List.of(selectedSort);
        });

        if (isInitial && getSearchStatus(getState()) === SearchStatus.SUCCEEDED) {
          return null;
        }

        dispatch(setFromQueryParamsAction({
          isInitial: isInitial,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        }));

        if (updatedSearchQuery.getFolderFilter()) {
          dispatch(fetchSelectedFolder(updatedSearchQuery));
        }

        return search({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery,
          isInitial: isInitial
        });
      };
    },
    setSearchQuery: function setSearchQuery(query) {
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter = getSelectedViewFilter(getState);
        var noSorts = List();
        var sorts = query ? noSorts : List([getMostRecentSort(getState)]);
        var updatedSearchQuery = searchQuery.merge({
          query: query,
          sorts: sorts,
          offset: 0
        });
        onSearch(looseItemContentType);
        dispatch(setSearchQueryAction(updatedSearchQuery));
        debouncedSearchFetch({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        });
      };
    },
    getPage: function getPage(page) {
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter = getSelectedViewFilter(getState);
        var limit = searchQuery.limit;
        var newOffset = page * limit;
        var updatedSearchQuery = searchQuery.set('offset', newOffset);
        dispatch(setSearchQueryAction(updatedSearchQuery));
        return search({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        });
      };
    },
    setSort: function setSort(_ref5) {
      var selectedSort = _ref5.selectedSort,
          _ref5$resetSearch = _ref5.resetSearch,
          resetSearch = _ref5$resetSearch === void 0 ? false : _ref5$resetSearch;
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter = getSelectedViewFilter(getState);
        var updatedSearchQuery = searchQuery.merge({
          query: resetSearch ? '' : searchQuery.query,
          offset: 0,
          sorts: List([selectedSort])
        });
        dispatch(setSortAction({
          selectedSort: selectedSort,
          searchQuery: updatedSearchQuery
        }));
        onSetSort(looseItemContentType, selectedSort);
        return search({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        });
      };
    },
    setSelectedFolder: function setSelectedFolder(folderSearchResult) {
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter = getSelectedViewFilter(getState);
        var folderId = folderSearchResult && folderSearchResult.contentId;
        var updatedSearchQuery = searchQuery.setFolderFilter(folderId).set('offset', 0);
        dispatch(setSelectedFolderAction({
          selectedFolder: folderSearchResult,
          searchQuery: updatedSearchQuery
        }));
        onSetFolder(looseItemContentType, folderId);
        return search({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        });
      };
    },
    setViewFilter: function setViewFilter(_ref6) {
      var type = _ref6.type,
          id = _ref6.id;
      return function (dispatch, getState) {
        var searchQuery = getSearchQuery(getState);
        var selectedViewFilter;

        if (type === FilterTypes.CUSTOM) {
          selectedViewFilter = getState().viewFilters.get(id);
        } else {
          var ViewFilter = type === FilterTypes.USER ? UserViewFilter : TeamViewFilter;
          selectedViewFilter = ViewFilter({
            looseItemContentType: looseItemContentType,
            id: id
          });
        }

        var updatedSearchQuery = searchQuery.merge({
          query: '',
          offset: 0,
          filters: selectedViewFilter.getFilters(id),
          sorts: List([selectedViewFilter.getSort()])
        });
        dispatch(setViewFilterAction({
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        }));
        onSetViewFilter(looseItemContentType, selectedViewFilter);
        return search({
          dispatch: dispatch,
          selectedViewFilter: selectedViewFilter,
          searchQuery: updatedSearchQuery
        });
      };
    }
  };
};

var SearchActions = {
  create: function create() {
    var _actions;

    return {
      init: function init(opts) {
        _actions = getActions(opts);
      },
      get: function get(action) {
        if (!_actions) {
          throw new Error('Must call init on SearchActions before retrieving actions');
        }

        return action ? _actions[action] : _actions;
      }
    };
  }
};
export default SearchActions.create();