'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FullPageError from '../../../errorBoundary/FullPageError';
import PageLoadingSpinner from './PageLoadingSpinner';
import { useFetchAllData } from '../hooks/useFetchAllData';
import RestorePage from './RestorePage';

var RestoreDataLoader = function RestoreDataLoader() {
  var _useFetchAllData = useFetchAllData(),
      loading = _useFetchAllData.loading,
      error = _useFetchAllData.error;

  if (error) {
    return /*#__PURE__*/_jsx(FullPageError, {});
  }

  if (loading) {
    return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
  }

  return /*#__PURE__*/_jsx(RestorePage, {});
};

export default RestoreDataLoader;