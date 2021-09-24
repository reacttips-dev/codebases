'use es6';

import { useCrmSearchQuery } from '../../crmSearch/hooks/useCrmSearchQuery';
import { useSearchQuery } from '../../searchQuery/hooks/useSearchQuery';
export var useTableQueryCache = function useTableQueryCache() {
  var query = useSearchQuery();
  return useCrmSearchQuery(query, {
    fetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-only'
  });
};