'use es6';

import { SET_RECONCILED_OBJECTS } from './localMutationsActionTypes';
export var setReconciledObjectsAction = function setReconciledObjectsAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectIdsToStageIds = _ref.objectIdsToStageIds,
      pipelineStagePropertyName = _ref.pipelineStagePropertyName;
  return {
    type: SET_RECONCILED_OBJECTS,
    payload: {
      objectTypeId: objectTypeId,
      objectIdsToStageIds: objectIdsToStageIds,
      pipelineStagePropertyName: pipelineStagePropertyName
    }
  };
};