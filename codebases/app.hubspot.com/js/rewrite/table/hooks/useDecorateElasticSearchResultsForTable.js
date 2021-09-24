'use es6';

import { useMemo } from 'react';
import { useTrackPreviousSearchResults } from '../../crmSearch/hooks/useTrackPreviousSearchResults';
import { useApplyLocalMutations } from '../../localMutations/hooks/useApplyLocalMutations';
export var useDecorateElasticSearchResultsForTable = function useDecorateElasticSearchResultsForTable(_ref) {
  var data = _ref.data,
      error = _ref.error,
      loading = _ref.loading;
  var dataToRender = useTrackPreviousSearchResults({
    data: data,
    loading: loading,
    error: error
  });
  var dataWithLocalChanges = useApplyLocalMutations(dataToRender);
  return useMemo(function () {
    return {
      data: dataWithLocalChanges,
      error: error,
      loading: loading
    };
  }, [dataWithLocalChanges, error, loading]);
};