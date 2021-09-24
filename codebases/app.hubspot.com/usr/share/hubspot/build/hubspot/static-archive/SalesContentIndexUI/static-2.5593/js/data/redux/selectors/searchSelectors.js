'use es6';

import { createSelector } from 'reselect';
export var totalSelector = function totalSelector(search) {
  return search.total;
};
export var searchResultsSelector = function searchResultsSelector(search) {
  return search.searchResults;
};
export var tempSearchResultsSelector = function tempSearchResultsSelector(search) {
  return search.tempSearchResults;
};
export var updatedSearchResultsSelector = function updatedSearchResultsSelector(search) {
  return search.updatedResults;
};
export var searchQuerySelector = function searchQuerySelector(search) {
  return search.searchQuery;
};
export var allContentFilterListSelector = function allContentFilterListSelector(search) {
  return search.allContentFilterList;
};
export var searchStatusSelector = function searchStatusSelector(search) {
  return search.searchStatus;
};
export var calculateTotalPages = createSelector(totalSelector, searchQuerySelector, function (total, searchQuery) {
  return Math.ceil(total / searchQuery.get('limit'));
});
export var selectSearchResultsForCurrentPage = createSelector(searchResultsSelector, tempSearchResultsSelector, updatedSearchResultsSelector, searchQuerySelector, function (searchResults, tempSearchResults, updatedResults, searchQuery) {
  return tempSearchResults.merge(searchResults).slice(0, searchQuery.get('limit')).map(function (searchResult) {
    return updatedResults.get(searchResult.id) || searchResult;
  });
});