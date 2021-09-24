'use es6';

import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { setReconciledObjectsAction } from '../actions/localMutationsActions';
import { useSelectedObjectTypeDef } from '../../../crmObjects/hooks/useSelectedObjectTypeDef';
export var useLocalMutationsActions = function useLocalMutationsActions() {
  var dispatch = useDispatch();

  var _useSelectedObjectTyp = useSelectedObjectTypeDef(),
      objectTypeId = _useSelectedObjectTyp.objectTypeId,
      pipelineStagePropertyName = _useSelectedObjectTyp.pipelineStagePropertyName;

  var setReconciledObjects = useCallback(function (_ref) {
    var objectIdsToStageIds = _ref.objectIdsToStageIds;
    return dispatch(setReconciledObjectsAction({
      objectTypeId: objectTypeId,
      objectIdsToStageIds: objectIdsToStageIds,
      pipelineStagePropertyName: pipelineStagePropertyName
    }));
  }, [dispatch, objectTypeId, pipelineStagePropertyName]);
  return {
    setReconciledObjects: setReconciledObjects
  };
};