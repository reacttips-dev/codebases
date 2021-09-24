'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FullPageError from '../../../errorBoundary/FullPageError';
import { useFetchAllData } from '../hooks/useFetchAllData';
import IndexViewRedirect from './IndexViewRedirect';
import PageLoadingSpinner from './PageLoadingSpinner';
import ErrorPage from '../../../crm_ui/error/ErrorPage';
import { NavMarker } from 'react-rhumb'; // TODO: We should ask the BE to give us more descriptive errors when this happens

export var didGraphqlFailBecauseOfMissingObjectTypeId = function didGraphqlFailBecauseOfMissingObjectTypeId(dataQueryError) {
  return Boolean(dataQueryError && dataQueryError.graphQLErrors && dataQueryError.graphQLErrors.find(function (error) {
    return error.message.includes('resource not found');
  }));
};
export var IndexDataLoader = function IndexDataLoader() {
  var _useFetchAllData = useFetchAllData(),
      loading = _useFetchAllData.loading,
      error = _useFetchAllData.error,
      dataQueryError = _useFetchAllData.dataQueryError;

  if (loading) {
    return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
  } // This must be checked above the standard error case because a missing objectType
  // will cause useFetchAllData to return error: true. If it was called after, the
  // less-specific error would take precedence and users would never see the 404.


  if (didGraphqlFailBecauseOfMissingObjectTypeId(dataQueryError)) {
    return /*#__PURE__*/_jsx(ErrorPage, {
      errorCode: "404",
      RhumbMarker: /*#__PURE__*/_jsx(NavMarker, {
        name: "FULL_PAGE_ERROR"
      })
    });
  }

  if (error) {
    return /*#__PURE__*/_jsx(FullPageError, {});
  }

  return /*#__PURE__*/_jsx(IndexViewRedirect, {});
};
export default IndexDataLoader;