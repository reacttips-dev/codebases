'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import AsyncTable from '../../table/components/AsyncTable';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import ElasticSearchError from './ElasticSearchError';
import { useTableQuery } from '../../table/hooks/useTableQuery';
import { useDecorateElasticSearchResultsForTable } from '../../table/hooks/useDecorateElasticSearchResultsForTable';

var IndexPageTable = function IndexPageTable() {
  var results = useTableQuery();

  var _useDecorateElasticSe = useDecorateElasticSearchResultsForTable(results),
      data = _useDecorateElasticSe.data,
      error = _useDecorateElasticSe.error,
      loading = _useDecorateElasticSe.loading;

  if (error) {
    return /*#__PURE__*/_jsx(ElasticSearchError, {
      error: error
    });
  } // It is possible for loading to be true but data to still have a value.
  // This is to support the feature where we render the previous query's data while
  // loading the new query. If loading is true and data does not have a value,
  // we cannot render the table and so must render a spinner.


  if (loading && !data) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      minHeight: 500
    });
  }

  return /*#__PURE__*/_jsx(AsyncTable, {
    data: data,
    error: error,
    loading: loading
  });
};

export default IndexPageTable;