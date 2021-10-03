import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  ADD_LAYER,
  UPDATE_LAYER,
  CLONE_LAYERS,
  DELETE_LAYERS,
  ADD_PAGE,
  CLONE_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
  SAVE_AS_TEMPLATE,
  MOVE_LAYER,
  LAYER_ACTION_STARTED,
  LAYER_COMPONENT_ACTION_STARTED,
  LAYER_COMPONENT_ACTION_STOPED,
  COPY_FROM_TEMPLATE,
  UPDATE_LAYER_PAYLOAD,
  GROUP,
  UNGROUP,
  UNDO,
  REDO,
  BROADCAST,
  UPDATE_LAYERS,
  UPDATE_STORY,
  UPDATE_ANIMATIONS,
  MOVE_ARTBOARD,
} from "./types";

export const wsConnect = (host) => ({ type: WEBSOCKET_CONNECT, host });
export const wsDisconnect = () => ({ type: WEBSOCKET_DISCONNECT });

// Custom studio actions
export const wsAddLayer = (pageId, payload) => ({
  type: ADD_LAYER,
  pageId,
  payload,
});

export const wsLayerActionStarted = () => ({ type: LAYER_ACTION_STARTED });
export const wsUpdateLayer = (payload) => ({ type: UPDATE_LAYER, payload });

export const wsUpdateLayers = (layers, pageId) => ({
  type: UPDATE_LAYERS,
  layers,
  pageId,
});
export const wsCloneLayers = (layerIds, pageId) => ({
  type: CLONE_LAYERS,
  layerIds,
  pageId,
});
export const wsDeleteLayers = (layerIds, pageId) => ({
  type: DELETE_LAYERS,
  layerIds,
  pageId,
});
export const wsMoveLayer = (method, payload) => ({
  type: MOVE_LAYER,
  method,
  payload,
});

export const updateLayerPayload = (payload) => ({
  type: UPDATE_LAYER_PAYLOAD,
  payload,
});

export const wsLayerComponentActionStarted = () => ({
  type: LAYER_COMPONENT_ACTION_STARTED,
});
export const wsLayerComponentActionStoped = () => ({
  type: LAYER_COMPONENT_ACTION_STOPED,
});

// Pages actions
export const wsUpdateAnimation = (payload) => ({
  type: UPDATE_ANIMATIONS,
  payload,
});
export const wsAddPage = () => ({ type: ADD_PAGE });
export const wsUpdatePage = (payload) => ({ type: UPDATE_PAGE, payload });
export const wsDeletePage = (payload) => ({ type: DELETE_PAGE, payload });
export const wsClonePage = (payload) => ({ type: CLONE_PAGE, payload });
export const wsSaveAsTemplate = (payload) => ({
  type: SAVE_AS_TEMPLATE,
  payload,
});

export const wsCopyFromTemplate = (pageId, templateId) => ({
  type: COPY_FROM_TEMPLATE,
  templateId: templateId,
  pageId,
});

export const wsGroup = (pageId, group, layers) => ({
  type: GROUP,
  pageId,
  group,
  layers,
});

export const wsUnGroup = (layerId, layers) => ({
  type: UNGROUP,
  layerId,
  layers,
});

export const wsUndo = () => ({ type: UNDO });
export const wsRedo = () => ({ type: REDO });
export const wsBroadcast = (payload) => ({ type: BROADCAST, payload });
export const processAction = (action, props) => {
  if (action === "add") {
    return addAction(props);
  } else if (action === "clone") {
    return cloneAction(props);
  } else if (action === "delete") {
    return deleteAction(props);
  }
};

const addAction = (props) => {
  const { activePage } = props.editor;

  // Add New Page
  if (activePage.isSelected) {
    return props.wsAddPage();
  }

  // Add New Layer
  var message = {
    mime: "text",
    payload: {
      size: { width: "94px", height: "24px" },
      position: { x: 66, y: 168 },
      editorHTML: "<p>Hello</p>",
    },
  };

  return props.wsAddLayer(activePage.id, message);
};

export const deleteAction = (props) => {
  const { activePage } = props.editor;

  // Delete current page
  if (activePage.isSelected) {
    props.wsDeletePage(activePage.id);
    props.setActivePage(null, null);
    return;
  }

  // Delete selected layer
  props.wsDeleteLayer(props.editor.activeLayer.id);
  props.setActiveLayer(null, null, null, null);
};

export const cloneAction = (props) => {
  const { activePage } = props.editor;

  // Clone selected page
  if (activePage.isSelected) {
    props.wsClonePage(activePage.id);
    return;
  }

  // Clone selected/active layer
  props.wsCloneLayer(props.editor.activeLayer.id);
};

export const wsUpdateStory = (payload) => ({
  type: UPDATE_STORY,
  payload,
});

export const moveArtboard = (pageId, destinationIndex) => ({
  type: MOVE_ARTBOARD,
  destinationIndex: destinationIndex,
  pageId,
});
