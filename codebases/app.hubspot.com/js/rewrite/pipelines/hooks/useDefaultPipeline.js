'use es6';

import { usePipelineById } from './usePipelineById';
import { getDefaultPipelineIdFromLocalStorage } from '../utils/pipelineIdLocalStorage';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var useDefaultPipeline = function useDefaultPipeline() {
  var objectTypeId = useSelectedObjectTypeId();
  var defaultPipelineId = getDefaultPipelineIdFromLocalStorage(objectTypeId);
  return usePipelineById(defaultPipelineId);
};