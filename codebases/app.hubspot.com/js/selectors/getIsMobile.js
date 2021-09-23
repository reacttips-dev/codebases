'use es6';

import { createSelector } from 'reselect';
import { getWidgetUiState } from './getWidgetUiState';
import { getIsFullscreen } from '../widget-ui/operators/getIsFullscreen';
import { getMobile } from '../widget-ui/operators/getMobile';
export var getIsMobile = createSelector([getWidgetUiState], function (widgetUiState) {
  return getMobile(widgetUiState) || getIsFullscreen(widgetUiState);
});