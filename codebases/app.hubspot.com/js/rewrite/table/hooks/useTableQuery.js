'use es6';

import { useCrmSearchQuery } from '../../crmSearch/hooks/useCrmSearchQuery';
import { BACKGROUND_REFRESH_INTERVAL_TIME } from '../../crmSearch/constants/cacheTime';
import { useSearchQuery } from '../../searchQuery/hooks/useSearchQuery';
export var useTableQuery = function useTableQuery() {
  var query = useSearchQuery();
  return useCrmSearchQuery(query, {
    pollInterval: BACKGROUND_REFRESH_INTERVAL_TIME
  });
};