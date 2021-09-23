'use es6';

import { OPEN_MODAL, CLOSE_MODAL, CLOSE_PANEL, OPEN_PANEL } from '../actions/overlayActionTypes';
import { NONE } from '../constants/none';
import { produce } from 'immer';
import { SYNC_ROUTER_VALUES } from '../../init/actions/initActionTypes';
import { EXPORT_VIEW_MODAL } from '../constants/modalTypes';
var initialState = {
  modalType: NONE,
  modalData: {},
  panelType: NONE,
  panelData: {}
};
export var overlayReducer = produce(function (draft, action) {
  switch (action.type) {
    case OPEN_MODAL:
      {
        var _action$payload = action.payload,
            modalType = _action$payload.modalType,
            modalData = _action$payload.modalData;
        draft.modalType = modalType;
        draft.modalData = modalData;
        return draft;
      }

    case CLOSE_MODAL:
      {
        draft.modalType = NONE;
        draft.modalData = {};
        return draft;
      }

    case OPEN_PANEL:
      {
        var _action$payload2 = action.payload,
            panelType = _action$payload2.panelType,
            panelData = _action$payload2.panelData;
        draft.panelType = panelType;
        draft.panelData = panelData;
        return draft;
      }

    case CLOSE_PANEL:
      {
        draft.panelType = NONE;
        draft.panelData = {};
        return draft;
      }

    case SYNC_ROUTER_VALUES:
      {
        draft.panelType = NONE;
        draft.panelData = {}; // When exporting from the "All views" page, we also select the exported view.
        // Without this conditional the modal opens then immediately closes.
        // We could remove this by simply not switching to the view when exporting.

        if (draft.modalType !== EXPORT_VIEW_MODAL) {
          draft.modalType = NONE;
          draft.modalData = {};
        }

        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);