'use es6';

import { getCanAccessPipeline } from '../utils/getCanAccessPipeline';
import { useMemo } from 'react';
import { usePipelines } from './usePipelines';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { BOARD } from '../../views/constants/PageType';
import { ALL_PIPELINES_VALUE } from '../constants/AllPipelinesValue';
import get from 'transmute/get';
export var useFallbackPipelineId = function useFallbackPipelineId() {
  var pipelines = usePipelines();
  var pageType = useCurrentPageType();
  var isBoard = pageType === BOARD;
  var firstPipelineWithAccess = useMemo(function () {
    return pipelines.find(function (pipeline) {
      return getCanAccessPipeline(pipeline);
    });
  }, [pipelines]); // We must have a pipeline for the board page, so this code arbitrarily picks the
  // first pipeline the we have access to if we're on the board page without one.

  if (isBoard) {
    // result must be null rather than undefined because the result will be
    // stored in localstorage (JSON)
    return get('pipelineId', firstPipelineWithAccess) || null;
  }

  return ALL_PIPELINES_VALUE;
};