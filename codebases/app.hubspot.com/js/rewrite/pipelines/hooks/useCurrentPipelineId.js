'use es6';

import { ALL_PIPELINES_VALUE } from '../constants/AllPipelinesValue';
import { BOARD } from '../../views/constants/PageType';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { useSelector } from 'react-redux';
import { getCurrentPipelineIdForCurrentType } from '../selectors/currentPipelineIdSelectors';
export var useCurrentPipelineId = function useCurrentPipelineId() {
  var currentPipeline = useSelector(getCurrentPipelineIdForCurrentType);
  var pageType = useCurrentPageType();

  if (pageType === BOARD && currentPipeline === ALL_PIPELINES_VALUE) {
    return null;
  }

  return currentPipeline;
};