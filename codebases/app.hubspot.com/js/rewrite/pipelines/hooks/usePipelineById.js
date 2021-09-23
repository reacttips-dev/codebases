'use es6';

import { useMemo } from 'react';
import { usePipelines } from './usePipelines';
export var usePipelineById = function usePipelineById(pipelineIdToFind) {
  var pipelines = usePipelines();
  return useMemo(function () {
    return pipelines.find(function (_ref) {
      var pipelineId = _ref.pipelineId;
      return pipelineId === pipelineIdToFind;
    });
  }, [pipelineIdToFind, pipelines]);
};