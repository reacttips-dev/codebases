'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import IndexPage from '../../app/components/IndexPage';
import { useSyncPipelineId } from '../../pipelines/hooks/useSyncPipelineId';
import { useHandleSpecialQueryParams } from '../hooks/useHandleSpecialQueryParams';
import PageLoadingSpinner from './PageLoadingSpinner';

var IndexPageContainer = function IndexPageContainer() {
  var hasHandledQueryParams = useHandleSpecialQueryParams();
  var hasSyncedPipeline = useSyncPipelineId();

  if (!hasHandledQueryParams || !hasSyncedPipeline) {
    return /*#__PURE__*/_jsx(PageLoadingSpinner, {});
  }

  return /*#__PURE__*/_jsx(IndexPage, {});
};

export default IndexPageContainer;