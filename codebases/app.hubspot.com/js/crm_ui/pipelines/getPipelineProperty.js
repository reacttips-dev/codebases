'use es6';

import { DEAL } from 'customer-data-objects/constants/ObjectTypes';
export function getPipelineProperty(objectType) {
  return objectType === DEAL ? 'pipeline' : 'hs_pipeline';
}