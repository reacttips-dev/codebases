'use es6';

import { createSelector } from 'reselect';
import { INITIALIZING, LOADING, EMPTY, ERROR, HAS_RESULTS, NO_RESULTS } from 'SalesContentIndexUI/data/constants/TableContentState';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import { totalSelector, allContentFilterListSelector, searchStatusSelector, searchQuerySelector } from './searchSelectors';
export var hasResultsSelector = createSelector(totalSelector, function (total) {
  return total > 0;
});
export var isInitializingSelector = function isInitializingSelector(search) {
  return search.isInitializing;
};
export var isFilteredSelector = createSelector(searchQuerySelector, allContentFilterListSelector, searchStatusSelector, function (searchQuery, allContentFilterList, searchStatus) {
  if (searchQuery.getFolderFilter() && searchQuery.getFolderFilter().values.size > 0) {
    return false;
  }

  if (searchQuery.offset > 0) {
    return false;
  }

  if (searchStatus !== SearchStatus.SUCCEEDED) {
    return false;
  }

  return !searchQuery.query && searchQuery.filters.toSet().equals(allContentFilterList.toSet());
});
export var isEmptyState = function isEmptyState(count) {
  return createSelector(hasResultsSelector, isFilteredSelector, function (hasResults, isFiltered) {
    return count === 0 || !hasResults && isFiltered;
  });
};
export var isNoResultsState = function isNoResultsState(count) {
  return createSelector(hasResultsSelector, isEmptyState(count), function (hasResults, isEmpty) {
    return !hasResults && !isEmpty;
  });
};
export var isErrorState = createSelector(searchStatusSelector, function (searchStatus) {
  return searchStatus === SearchStatus.FAILED;
});
export var isLoadingState = createSelector(searchStatusSelector, function (searchStatus) {
  return searchStatus === SearchStatus.LOADING;
});
export var selectTableContentState = function selectTableContentState(count) {
  return createSelector(isInitializingSelector, isLoadingState, isErrorState, isEmptyState(count), isNoResultsState(count), function (isInitializing, isLoading, hasError, isEmpty, hasNoResults) {
    if (isInitializing) {
      return INITIALIZING;
    }

    if (isLoading) {
      return LOADING;
    }

    if (hasError) {
      return ERROR;
    }

    if (isEmpty) {
      return EMPTY;
    }

    if (hasNoResults) {
      return NO_RESULTS;
    }

    return HAS_RESULTS;
  });
};