'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, OrderedMap, List } from 'immutable';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import { SET_SEARCH_QUERY, SET_SORT, SET_SELECTED_FOLDER, SET_VIEW_FILTER, SEARCH_FETCH_SUCCEEDED, SEARCH_FETCH_FAILED, SET_FROM_MODAL, SET_FROM_QUERY_PARAMS, ADD_TEMP_RESULT, UPDATE_RESULT, REMOVE_RESULT, REMOVE_RESULTS, REPLACE_RESULT, REPLACE_RESULT_AFTER_SEARCH, FOLDER_FETCH_SUCCEEDED } from 'SalesContentIndexUI/data/constants/ActionTypes';

var setSearchResults = function setSearchResults(results) {
  var afterSearchReplacements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  return results.reduce(function (searchResultsMap, result) {
    var searchResult = SearchResultRecord.init(result);
    return searchResultsMap.set(searchResult.id, afterSearchReplacements.get(searchResult.id, searchResult));
  }, OrderedMap());
};

var removeResults = function removeResults(deletedSearchResultIds, results) {
  return deletedSearchResultIds.reduce(function (updatedSearchResults, id) {
    return updatedSearchResults.remove(id);
  }, results);
};

var replaceResults = function replaceResults(idToReplace, replacementResult, results) {
  return results.reduce(function (newResultsMap, result) {
    var resultToUse = result.id === idToReplace ? replacementResult : result;
    return newResultsMap.set(resultToUse.id, resultToUse);
  }, OrderedMap());
};

export default (function (_ref) {
  var defaultViewFilter = _ref.defaultViewFilter,
      allContentFilterList = _ref.allContentFilterList,
      looseItemContentType = _ref.looseItemContentType,
      folderContentType = _ref.folderContentType,
      options = _ref.options;
  var currentSort = options.currentSort,
      searchLimit = options.searchLimit;
  var initialState = {
    isInitializing: true,
    defaultViewFilter: defaultViewFilter,
    allContentFilterList: allContentFilterList,
    selectedViewFilter: defaultViewFilter,
    currentSort: currentSort,
    mostRecentSort: currentSort,
    searchResults: OrderedMap(),
    afterSearchReplacements: ImmutableMap(),
    tempSearchResults: OrderedMap(),
    updatedResults: OrderedMap(),
    searchQuery: new SearchQueryRecord({
      offset: 0,
      limit: searchLimit,
      filters: defaultViewFilter.getFilters(),
      sorts: List([currentSort]),
      contentTypesToHydrate: folderContentType ? List([looseItemContentType, folderContentType]) : List([looseItemContentType])
    }),
    total: 0,
    searchStatus: SearchStatus.LOADING,
    selectedFolder: null
  };
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case SET_SEARCH_QUERY:
        return Object.assign({}, state, {
          tempSearchResults: OrderedMap(),
          searchQuery: action.payload,
          searchStatus: SearchStatus.LOADING,
          // Don't set mostRecentSort here as it is either undefined or itself
          currentSort: action.payload.sorts.first()
        });

      case SET_FROM_MODAL:
        {
          var _action$payload = action.payload,
              isInitial = _action$payload.isInitial,
              searchQuery = _action$payload.searchQuery;
          return Object.assign({}, state, {
            searchQuery: searchQuery,
            tempSearchResults: !isInitial ? OrderedMap() : state.tempSearchResults,
            searchStatus: !isInitial ? SearchStatus.LOADING : state.searchStatus
          });
        }

      case SET_FROM_QUERY_PARAMS:
        {
          var _action$payload2 = action.payload,
              _isInitial = _action$payload2.isInitial,
              _searchQuery = _action$payload2.searchQuery,
              selectedViewFilter = _action$payload2.selectedViewFilter,
              selectedFolder = _action$payload2.selectedFolder;
          return Object.assign({}, state, {
            searchQuery: _searchQuery,
            selectedFolder: selectedFolder,
            tempSearchResults: !_isInitial ? OrderedMap() : state.tempSearchResults,
            selectedViewFilter: selectedViewFilter || state.selectedViewFilter,
            searchStatus: !_isInitial ? SearchStatus.LOADING : state.searchStatus,
            mostRecentSort: _searchQuery.sorts.first(),
            currentSort: _searchQuery.sorts.first()
          });
        }

      case SET_SORT:
        {
          var _action$payload3 = action.payload,
              selectedSort = _action$payload3.selectedSort,
              _searchQuery2 = _action$payload3.searchQuery;
          return Object.assign({}, state, {
            searchQuery: _searchQuery2,
            tempSearchResults: OrderedMap(),
            mostRecentSort: selectedSort,
            currentSort: selectedSort,
            searchStatus: SearchStatus.LOADING
          });
        }

      case SET_SELECTED_FOLDER:
        {
          var _action$payload4 = action.payload,
              _selectedFolder = _action$payload4.selectedFolder,
              _searchQuery3 = _action$payload4.searchQuery;
          return Object.assign({}, state, {
            selectedFolder: _selectedFolder,
            searchQuery: _searchQuery3,
            tempSearchResults: OrderedMap(),
            searchStatus: SearchStatus.LOADING
          });
        }

      case SET_VIEW_FILTER:
        {
          var _action$payload5 = action.payload,
              _selectedViewFilter = _action$payload5.selectedViewFilter,
              _searchQuery4 = _action$payload5.searchQuery;
          return Object.assign({}, state, {
            selectedViewFilter: _selectedViewFilter,
            searchQuery: _searchQuery4,
            tempSearchResults: OrderedMap(),
            mostRecentSort: _selectedViewFilter.getSort(),
            currentSort: _selectedViewFilter.getSort(),
            selectedFolder: null,
            searchStatus: SearchStatus.LOADING
          });
        }

      case SEARCH_FETCH_SUCCEEDED:
        {
          var _action$payload$toObj = action.payload.toObject(),
              results = _action$payload$toObj.results,
              total = _action$payload$toObj.total;

          return Object.assign({}, state, {
            isInitializing: false,
            total: total,
            searchResults: setSearchResults(results, state.afterSearchReplacements),
            searchStatus: SearchStatus.SUCCEEDED,
            afterSearchReplacements: ImmutableMap()
          });
        }

      case SEARCH_FETCH_FAILED:
        return Object.assign({}, state, {
          isInitializing: false,
          searchStatus: SearchStatus.FAILED
        });

      case ADD_TEMP_RESULT:
        {
          var searchResult = action.payload;
          return Object.assign({}, state, {
            total: state.total + 1,
            tempSearchResults: OrderedMap(_defineProperty({}, searchResult.id, searchResult)).merge(state.tempSearchResults)
          });
        }

      case UPDATE_RESULT:
        {
          var updatedSearchResult = action.payload;
          return Object.assign({}, state, {
            updatedResults: state.updatedResults.set(updatedSearchResult.id, updatedSearchResult)
          });
        }

      case REMOVE_RESULT:
        {
          var deletedSearchResultIds = List([action.payload]);
          return Object.assign({}, state, {
            total: state.total - 1,
            searchResults: removeResults(deletedSearchResultIds, state.searchResults),
            tempSearchResults: removeResults(deletedSearchResultIds, state.tempSearchResults)
          });
        }

      case REMOVE_RESULTS:
        {
          var _deletedSearchResultIds = action.payload;
          return Object.assign({}, state, {
            total: state.total - _deletedSearchResultIds.size,
            searchResults: removeResults(_deletedSearchResultIds, state.searchResults),
            tempSearchResults: removeResults(_deletedSearchResultIds, state.tempSearchResults)
          });
        }

      case REPLACE_RESULT:
        {
          var _action$payload6 = action.payload,
              idToReplace = _action$payload6.idToReplace,
              replacementResult = _action$payload6.replacementResult;
          return Object.assign({}, state, {
            searchResults: replaceResults(idToReplace, replacementResult, state.searchResults),
            tempSearchResults: replaceResults(idToReplace, replacementResult, state.tempSearchResults)
          });
        }

      case REPLACE_RESULT_AFTER_SEARCH:
        {
          var _action$payload7 = action.payload,
              _idToReplace = _action$payload7.idToReplace,
              _replacementResult = _action$payload7.replacementResult;
          return Object.assign({}, state, {
            searchResults: replaceResults(_idToReplace, _replacementResult, state.searchResults),
            tempSearchResults: replaceResults(_idToReplace, _replacementResult, state.tempSearchResults),
            afterSearchReplacements: state.afterSearchReplacements.set(_idToReplace, _replacementResult)
          });
        }

      case FOLDER_FETCH_SUCCEEDED:
        {
          return Object.assign({}, state, {
            selectedFolder: SearchResultRecord.init(action.payload)
          });
        }

      default:
        return state;
    }
  };
});