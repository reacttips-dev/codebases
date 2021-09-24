'use es6';

import { useMemo } from 'react';
import { useCurrentPipelineId } from './useCurrentPipelineId';
import { usePipelines } from './usePipelines';
export var useCurrentPipeline = function useCurrentPipeline() {
  var pipelines = usePipelines();
  var currentPipelineId = useCurrentPipelineId(); // TODO: Default to first pipeline?

  return useMemo(function () {
    return pipelines.find(function (_ref) {
      var pipelineId = _ref.pipelineId;
      return pipelineId === currentPipelineId;
    });
  }, [currentPipelineId, pipelines]);
};