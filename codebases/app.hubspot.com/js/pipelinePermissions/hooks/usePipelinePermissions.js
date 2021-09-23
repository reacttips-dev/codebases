'use es6';

import { useStoreDependency } from 'general-store';
import { pipelinePermissionsDep } from 'crm_data/pipelinePermissions/pipelinePermissionsDep';
import { useSelectedObjectTypeId } from '../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
export var usePipelinePermissions = function usePipelinePermissions() {
  var objectTypeId = useSelectedObjectTypeId();
  return useStoreDependency(pipelinePermissionsDep, {
    objectTypeId: objectTypeId
  });
};