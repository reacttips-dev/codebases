import { CLOSE_BOTTOM_PANEL, OPEN_BOTTOM_PANEL } from "../_actions/types";
import { BottomPanelState, BottomPanelViewTypes } from "../_utils/constants";

const initialState = {
  viewState: BottomPanelState.OPEN,
  viewType: BottomPanelViewTypes.PREVIEW_ARTBOARDS,
};

const bottomPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_BOTTOM_PANEL:
      return {
        ...state,
        viewType: action.payload,
        viewState: BottomPanelState.OPEN,
      };
    case CLOSE_BOTTOM_PANEL:
      return {
        ...state,
        viewState: BottomPanelState.CLOSE,
        viewType: BottomPanelViewTypes.PREVIEW_ARTBOARDS,
      };
    default:
      return state;
  }
};

export default bottomPanelReducer;
