'use es6';

import { calculateMaxWidgetHeight } from './calculateMaxWidgetHeight';
import { calculateMinWidgetHeight } from './calculateMinWidgetHeight';
export function calculatePixelsToShrinkBy(windowHeight, _ref) {
  var showCloseButton = _ref.showCloseButton;
  var maxWidgetHeight = calculateMaxWidgetHeight({
    showCloseButton: showCloseButton
  });
  var minWidgetHeight = calculateMinWidgetHeight({
    showCloseButton: showCloseButton
  });

  if (windowHeight >= maxWidgetHeight) {
    return 0;
  }

  if (windowHeight <= minWidgetHeight) {
    return maxWidgetHeight - minWidgetHeight;
  }

  return maxWidgetHeight - windowHeight;
}