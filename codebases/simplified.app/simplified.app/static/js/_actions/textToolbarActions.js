import {
  ACTIVATE_ELEMENT,
  ACTIVATE_PAGE,
  SCALE_ELEMENT,
  ACTIVE_ELEMENT_FORMAT,
  SET_CROP,
  ADD_SELECTED_ELEMENT,
  REMOVE_SELECTED_ELEMENT,
  CLEAR_SELECTED_ELEMENTS,
  GROUP_SELECTION_STATE,
  CLONED_LAYER_IDS,
  SET_VIDEO_PLAY_STATUS,
} from "./types";

export const setActiveLayer = (
  elementId,
  elementType,
  elementFormat,
  elementParentId,
  selectedTab
) => {
  return {
    type: ACTIVATE_ELEMENT,
    payload: {
      elementId: elementId,
      elementType: elementType,
      elementFormat: elementFormat,
      elementParentId: elementParentId,
      selectedTab: selectedTab,
    },
  };
};

export const setActivePage = (pageId, pageIndex, isSelected) => {
  return {
    type: ACTIVATE_PAGE,
    payload: {
      id: pageId,
      isSelected: isSelected,
      pageIndex: pageIndex,
    },
  };
};

export const setScale = (scale) => {
  return {
    type: SCALE_ELEMENT,
    payload: scale,
  };
};

export const setElementFormat = (format) => {
  return {
    type: ACTIVE_ELEMENT_FORMAT,
    payload: format,
  };
};

export const setCrop = (isEnable) => {
  return {
    type: SET_CROP,
    payload: isEnable,
  };
};

export const setVideoPlayingStatus = (isPlaying) => {
  return {
    type: SET_VIDEO_PLAY_STATUS,
    payload: isPlaying,
  };
};

export const addSelectedElement = (elementId) => {
  return {
    type: ADD_SELECTED_ELEMENT,
    payload: elementId,
  };
};

export const removeSelectedElement = (elementId) => {
  return {
    type: REMOVE_SELECTED_ELEMENT,
    payload: elementId,
  };
};

export const clearSelectedElement = () => {
  return {
    type: CLEAR_SELECTED_ELEMENTS,
    payload: [],
  };
};

export const setGroupSelection = (objectType, ids) => {
  return {
    type: GROUP_SELECTION_STATE,
    payload: {
      mime: objectType,
      selectedIds: ids,
    },
  };
};

export const setClonedItems = (ids) => {
  return {
    type: CLONED_LAYER_IDS,
    payload: {
      selectedIds: ids,
    },
  };
};
