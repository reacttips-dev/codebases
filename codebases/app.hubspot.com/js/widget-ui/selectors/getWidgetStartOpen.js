'use es6';

import { createSelector } from 'reselect';
import { getStartOpen } from '../operators/getStartOpen';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
export var getWidgetStartOpen = createSelector([getWidgetUiState], function (widgetUiState) {
  return getStartOpen(widgetUiState);
});