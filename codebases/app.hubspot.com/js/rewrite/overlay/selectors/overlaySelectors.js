'use es6';

import { createFrozenSelector } from '../../utils/createFrozenSelector';

var getOverlaySlice = function getOverlaySlice(state) {
  return state.overlay;
};

export var getModalType = createFrozenSelector([getOverlaySlice], function (slice) {
  return slice.modalType;
});
export var getModalData = createFrozenSelector([getOverlaySlice], function (slice) {
  return slice.modalData;
});
export var getPanelType = createFrozenSelector([getOverlaySlice], function (slice) {
  return slice.panelType;
});
export var getPanelData = createFrozenSelector([getOverlaySlice], function (slice) {
  return slice.panelData;
});