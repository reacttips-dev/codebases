'use es6';

import { BASE_WIDGET_HEIGHT, SPACING_ABOVE_WIDGET, CLOSE_BUTTON_AND_SPACING } from './constants/dimensions';
export function calculateMaxWidgetHeight(_ref) {
  var showCloseButton = _ref.showCloseButton;
  var maxHeight = BASE_WIDGET_HEIGHT + SPACING_ABOVE_WIDGET;

  if (showCloseButton) {
    maxHeight += CLOSE_BUTTON_AND_SPACING;
  }

  return maxHeight;
}