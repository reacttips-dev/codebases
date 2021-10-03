import {
  OPEN_ADVANCED_SETTINGS,
  CLOSE_ADVANCED_SETTINGS,
  ACTIVATE_ELEMENT,
} from "../_actions/types";
import {
  ADVANCED_EDITOR_PANEL,
  ADVANCED_EDITOR_EDIT,
} from "../_components/details/constants";

export const initialState = {
  isActionPanelOpen: false,
  selectedTab: ADVANCED_EDITOR_EDIT,
  sliderPanelType: ADVANCED_EDITOR_PANEL,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case OPEN_ADVANCED_SETTINGS:
      return {
        ...state,
        isActionPanelOpen: true,
        selectedTab: action.payload.selectedTab
          ? action.payload.selectedTab
          : ADVANCED_EDITOR_EDIT,
        sliderPanelType: action.payload.panel
          ? action.payload.panel
          : ADVANCED_EDITOR_PANEL,
      };

    case CLOSE_ADVANCED_SETTINGS:
      return {
        ...state,
        isActionPanelOpen: false,
        selectedTab: ADVANCED_EDITOR_EDIT,
      };
    case ACTIVATE_ELEMENT:
      return {
        ...state,
        selectedTab: action.payload.selectedTab
          ? action.payload.selectedTab
          : ADVANCED_EDITOR_EDIT,
      };
    default:
      return state;
  }
}
