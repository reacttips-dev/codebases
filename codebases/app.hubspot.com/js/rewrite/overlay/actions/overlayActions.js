'use es6';

import { OPEN_MODAL, CLOSE_MODAL, OPEN_PANEL, CLOSE_PANEL } from './overlayActionTypes';
export var openModalAction = function openModalAction(modalType) {
  var modalData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    type: OPEN_MODAL,
    payload: {
      modalType: modalType,
      modalData: modalData
    }
  };
};
export var closeModalAction = function closeModalAction() {
  return {
    type: CLOSE_MODAL
  };
};
export var openPanelAction = function openPanelAction(panelType) {
  var panelData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    type: OPEN_PANEL,
    payload: {
      panelType: panelType,
      panelData: panelData
    }
  };
};
export var closePanelAction = function closePanelAction() {
  return {
    type: CLOSE_PANEL
  };
};