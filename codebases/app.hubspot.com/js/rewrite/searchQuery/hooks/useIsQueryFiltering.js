'use es6';

import { useSearchQuery } from './useSearchQuery';
import get from 'transmute/get';
export var useIsQueryFiltering = function useIsQueryFiltering() {
  var query = useSearchQuery();
  var filterGroups = get('filterGroups', query) || [];
  var hasFilters = filterGroups.some(function (_ref) {
    var filters = _ref.filters;
    return filters && filters.length > 0;
  });
  var searchTerm = get('query', query);
  var hasSearchTerm = Boolean(searchTerm);
  return hasFilters || hasSearchTerm;
};