'use es6';

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { changePipelineAction } from '../actions/currentPipelineIdActions';
import { ALL_PIPELINES_VALUE } from '../constants/AllPipelinesValue';
import { clearDefaultPipelineIdInLocalStorage, setDefaultPipelineIdInLocalStorage } from '../utils/pipelineIdLocalStorage';
export var useCurrentPipelineIdActions = function useCurrentPipelineIdActions() {
  var objectTypeId = useSelectedObjectTypeId();
  var dispatch = useDispatch();
  var changePipeline = useCallback(function (pipelineId) {
    if (pipelineId === ALL_PIPELINES_VALUE) {
      clearDefaultPipelineIdInLocalStorage(objectTypeId);
    } else {
      setDefaultPipelineIdInLocalStorage(objectTypeId, pipelineId);
    }

    return dispatch(changePipelineAction({
      objectTypeId: objectTypeId,
      pipelineId: pipelineId
    }));
  }, [dispatch, objectTypeId]);
  return {
    changePipeline: changePipeline
  };
};