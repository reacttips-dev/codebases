'use es6';

import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import getIn from 'transmute/getIn';
export var getCanAccessPipeline = function getCanAccessPipeline(pipeline) {
  return getIn(['permission', 'accessLevel'], pipeline) !== HIDDEN;
};