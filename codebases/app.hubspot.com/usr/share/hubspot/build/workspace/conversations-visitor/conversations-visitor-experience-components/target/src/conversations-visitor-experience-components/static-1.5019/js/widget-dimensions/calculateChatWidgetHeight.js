'use es6';

import { BASE_WIDGET_HEIGHT } from './constants/dimensions';
import { calculatePixelsToShrinkBy } from './calculatePixelsToShrinkBy';
export function calculateChatWidgetHeight(windowHeight, _ref) {
  var showCloseButton = _ref.showCloseButton;
  return BASE_WIDGET_HEIGHT - calculatePixelsToShrinkBy(windowHeight, {
    showCloseButton: showCloseButton
  });
}