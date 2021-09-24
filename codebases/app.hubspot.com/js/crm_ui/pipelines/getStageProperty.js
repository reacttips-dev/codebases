'use es6';

import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
export function getStageProperty(objectType) {
  return objectType === DEAL ? 'dealstage' : 'hs_pipeline_stage';
}