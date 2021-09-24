'use es6';

import { useEffect, useMemo } from 'react';
import { useFallbackPipelineId } from './useFallbackPipelineId';
import { useViewPipeline } from './useViewPipeline';
import { BOARD } from '../../views/constants/PageType';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { ALL_PIPELINES_VALUE, ALL_PIPELINES_VALUE_FROM_QUERY_PARAM } from '../constants/AllPipelinesValue';
import { useCurrentPipeline } from './useCurrentPipeline';
import { useCurrentPipelineId } from './useCurrentPipelineId';
import { useDefaultPipeline } from './useDefaultPipeline';
import { useCurrentPipelineIdActions } from './useCurrentPipelineIdActions';
import { getCanAccessPipeline } from '../utils/getCanAccessPipeline';
import get from 'transmute/get';
import { useQueryParams } from '../../../router/useQueryParams';
import { usePipelineById } from './usePipelineById';
import { useNavigate } from '../../navigation/hooks/useNavigate';
export var getNextPipelineId = function getNextPipelineId(_ref) {
  var queryParamPipelineId = _ref.queryParamPipelineId,
      queryParamPipeline = _ref.queryParamPipeline,
      currentPipeline = _ref.currentPipeline,
      currentPipelineId = _ref.currentPipelineId,
      defaultPipeline = _ref.defaultPipeline,
      fallbackPipelineId = _ref.fallbackPipelineId,
      isBoard = _ref.isBoard,
      viewPipeline = _ref.viewPipeline;

  if (!isBoard && queryParamPipelineId === ALL_PIPELINES_VALUE_FROM_QUERY_PARAM) {
    return ALL_PIPELINES_VALUE;
  }

  if (queryParamPipeline && getCanAccessPipeline(queryParamPipeline)) {
    return get('pipelineId', queryParamPipeline);
  }

  if (viewPipeline && getCanAccessPipeline(viewPipeline)) {
    return get('pipelineId', viewPipeline);
  }

  if (defaultPipeline && getCanAccessPipeline(defaultPipeline)) {
    return get('pipelineId', defaultPipeline);
  } // this condition will only trigger if currentPipeline is a real pipeline


  if (currentPipeline && getCanAccessPipeline(currentPipeline)) {
    return get('pipelineId', currentPipeline);
  } // ALL_PIPELINES_VALUE is not a real pipeline and thus does not have data, but
  // it can be the value of currentPipelineId when on the table


  if (!isBoard && currentPipelineId === ALL_PIPELINES_VALUE) {
    return currentPipelineId;
  }

  return fallbackPipelineId;
};
export var useSyncPipelineId = function useSyncPipelineId() {
  var pageType = useCurrentPageType();
  var isBoard = pageType === BOARD;

  var _useQueryParams = useQueryParams(),
      queryParamPipelineId = _useQueryParams.pipelineId;

  var queryParamPipeline = usePipelineById(queryParamPipelineId);
  var viewPipeline = useViewPipeline();
  var fallbackPipelineId = useFallbackPipelineId();
  var currentPipelineId = useCurrentPipelineId(); // ALL_PIPELINES_VALUE does not have data, so in the case that currentPipelineId
  // is ALL_PIPELINES_VALUE, currentPipeline will be undefined

  var currentPipeline = useCurrentPipeline();
  var defaultPipeline = useDefaultPipeline();
  var nextPipelineId = useMemo(function () {
    return getNextPipelineId({
      queryParamPipelineId: queryParamPipelineId,
      queryParamPipeline: queryParamPipeline,
      currentPipeline: currentPipeline,
      currentPipelineId: currentPipelineId,
      defaultPipeline: defaultPipeline,
      fallbackPipelineId: fallbackPipelineId,
      isBoard: isBoard,
      viewPipeline: viewPipeline
    });
  }, [queryParamPipelineId, queryParamPipeline, currentPipeline, currentPipelineId, defaultPipeline, fallbackPipelineId, isBoard, viewPipeline]);
  var shouldSync = currentPipelineId !== nextPipelineId || queryParamPipelineId;

  var _useCurrentPipelineId = useCurrentPipelineIdActions(),
      changePipeline = _useCurrentPipelineId.changePipeline;

  useEffect(function () {
    if (shouldSync) {
      changePipeline(nextPipelineId);
    }
  }, [changePipeline, nextPipelineId, shouldSync]);
  var navigate = useNavigate();
  useEffect(function () {
    if (queryParamPipelineId) {
      navigate({
        query: {
          pipelineId: undefined
        }
      });
    }
  }, [navigate, queryParamPipelineId]);
  return !shouldSync;
};