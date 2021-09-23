'use es6';

import { useMemo } from 'react';
import { groupBy } from '../../objectUtils/groupBy';
import { PROPERTY } from '../constants/RequirementTypes';
import { useObjectRequirements } from './useObjectRequirements';
export var usePropertyRequirementsForPipelineStages = function usePropertyRequirementsForPipelineStages() {
  var requirements = useObjectRequirements(); // Get property requirements that are attached to a pipeline

  var pipelineStagePropertyRequirements = useMemo(function () {
    return requirements.filter(function (_ref) {
      var hasPipeline = _ref.hasPipeline,
          requirementType = _ref.requirementType,
          pipelineStageId = _ref.pipelineStageId;
      return hasPipeline && pipelineStageId != null && requirementType === PROPERTY;
    });
  }, [requirements]); // Sort the requirements by displayOrder

  var sortedRequirements = useMemo(function () {
    return pipelineStagePropertyRequirements.sort(function (reqA, reqB) {
      return reqA.displayOrder - reqB.displayOrder;
    });
  }, [pipelineStagePropertyRequirements]); // Group the requirements by stageId

  return useMemo(function () {
    return groupBy(function (_ref2) {
      var pipelineStageId = _ref2.pipelineStageId;
      return pipelineStageId;
    }, sortedRequirements);
  }, [sortedRequirements]);
};