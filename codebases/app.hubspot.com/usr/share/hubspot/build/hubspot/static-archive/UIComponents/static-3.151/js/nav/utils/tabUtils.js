'use es6';

import { ENCLOSED_SHADED_SELECTED_BACKGROUND_COLOR, ENCLOSED_SELECTED_BACKGROUND_COLOR } from '../TabConstants';
export var USES = ['default', 'enclosed', 'enclosed-shaded', 'flush', 'header', 'toolbar'];
export var isContained = function isContained(use) {
  return use === 'enclosed' || use === 'enclosed-shaded' || use === 'flush' || use === 'toolbar';
};
export var getSelectedTabBackgroundColor = function getSelectedTabBackgroundColor(use) {
  return use === 'enclosed-shaded' ? ENCLOSED_SHADED_SELECTED_BACKGROUND_COLOR : ENCLOSED_SELECTED_BACKGROUND_COLOR;
};