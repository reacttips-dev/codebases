'use es6';

import { SELECT_IMAGE_OPTIMIZATION_SETTING } from './ActionTypes';
export function selectImageOptimizationSetting(imageOptimizationSetting) {
  return {
    type: SELECT_IMAGE_OPTIMIZATION_SETTING,
    imageOptimizationSetting: imageOptimizationSetting
  };
}