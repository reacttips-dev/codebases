import {
  ACTIVATE_ELEMENT,
  ACTIVATE_PAGE,
  SCALE_ELEMENT,
  SET_CROP,
  ACTIVE_ELEMENT_FORMAT,
  LAYER_COMPONENT_ACTION_STARTED,
  LAYER_COMPONENT_ACTION_STOPED,
  ADD_SELECTED_ELEMENT,
  REMOVE_SELECTED_ELEMENT,
  CLEAR_SELECTED_ELEMENTS,
  GROUP_SELECTION_STATE,
  CLONED_LAYER_IDS,
  SET_VIDEO_PLAY_STATUS,
} from "../_actions/types";

export const initialState = {
  activeElement: {
    id: null,
    mime: null,
    format: {},
    cropEnable: false,
    isVideoPlaying: false,
    parentId: null,
  },
  activePage: {
    id: null,
    isSelected: false,
    pageIndex: 0,
  },
  activeSelection: {
    selectedElements: [],
    mime: null,
  },
  clonedLayerIds: [],
  scale: 1,
  inProcess: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ACTIVATE_ELEMENT:
      return {
        ...state,
        activeElement: {
          ...state.activeElement,
          id: action.payload.elementId,
          mime: action.payload.elementType,
          format: action.payload.elementFormat,
          parentId: action.payload.elementParentId,
        },
        activePage: {
          ...state.activePage,
          isSelected: action.payload.elementId ? false : true,
        },
      };
    case ACTIVATE_PAGE:
      return {
        ...state,
        activeElement: {
          id: null,
          mime: null,
          format: {},
          cropEnable: false,
        },
        activePage: {
          id: action.payload.id,
          isSelected: action.payload.isSelected,
          pageIndex: action.payload.pageIndex,
        },
      };

    case ACTIVE_ELEMENT_FORMAT:
      return {
        ...state,
        activeElement: {
          ...state.activeElement,
          format: action.payload,
        },
      };
    case SCALE_ELEMENT:
      return {
        ...state,
        scale: action.payload,
      };
    case SET_CROP:
      return {
        ...state,
        activeElement: {
          ...state.activeElement,
          cropEnable: action.payload,
        },
      };
    case SET_VIDEO_PLAY_STATUS:
      return {
        ...state,
        activeElement: {
          ...state.activeElement,
          isVideoPlaying: action.payload,
        },
      };
    case LAYER_COMPONENT_ACTION_STARTED:
      return {
        ...state,
        inProcess: true,
      };
    case LAYER_COMPONENT_ACTION_STOPED:
      return {
        ...state,
        inProcess: false,
      };

    // REMOVE THIS CODE LEGACY CODE
    case ADD_SELECTED_ELEMENT:
      return {
        ...state,
        selectedElements: state.selectedElements.concat(action.payload),
      };
    case REMOVE_SELECTED_ELEMENT:
      return {
        ...state,
        selectedElements: state.selectedElements.filter((elementId, index) => {
          return elementId !== action.payload;
        }),
      };
    case CLEAR_SELECTED_ELEMENTS:
      return {
        ...state,
        selectedElements: [],
      };
    case GROUP_SELECTION_STATE:
      return {
        ...state,
        activeSelection: {
          mime: action.payload.mime,
          selectedElements: action.payload.selectedIds,
        },
      };
    case CLONED_LAYER_IDS:
      return {
        ...state,
        clonedLayerIds: action.payload.selectedIds,
      };
    default:
      return state;
  }
}
