'use es6';

import { PIPELINE_CHANGED } from './currentPipelineIdActionTypes';
export var changePipelineAction = function changePipelineAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      pipelineId = _ref.pipelineId;
  return {
    type: PIPELINE_CHANGED,
    payload: {
      objectTypeId: objectTypeId,
      pipelineId: pipelineId
    }
  };
};