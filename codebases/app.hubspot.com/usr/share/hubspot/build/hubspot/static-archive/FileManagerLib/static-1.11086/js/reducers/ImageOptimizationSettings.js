'use es6';

import Immutable from 'immutable';
import { SELECT_IMAGE_OPTIMIZATION_SETTING } from '../actions/ActionTypes';
import { SELECT_FILE } from 'FileManagerCore/actions/ActionTypes';
import * as ImageOptimizationSettings from '../enums/ImageOptimizationSettings';
var defaultState = Immutable.Map({
  imageOptimizationSetting: ImageOptimizationSettings.MEDIUM
});
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      imageOptimizationSetting = action.imageOptimizationSetting,
      selectedFile = action.selectedFile;

  switch (type) {
    case SELECT_FILE:
      if (selectedFile) {
        return defaultState;
      }

      return state;

    case SELECT_IMAGE_OPTIMIZATION_SETTING:
      return state.set('imageOptimizationSetting', imageOptimizationSetting);

    default:
      return state;
  }
});