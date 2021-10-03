import ReconnectingWebSocket from "reconnecting-websocket";
import { batch } from "react-redux";
import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSED,
  ADD_LAYER,
  ADDED_LAYER,
  ADDED_LAYERS,
  UPDATE_LAYER,
  UPDATED_LAYER,
  DELETE_LAYERS,
  DELETED_LAYERS,
  CLONE_LAYERS,
  ADD_PAGE,
  ADDED_PAGE,
  ADDED_PAGES,
  WEBSOCKET_MESSAGE,
  DELETE_PAGE,
  DELETED_PAGE,
  CLONE_PAGE,
  UPDATED_PAGE,
  UPDATE_PAGE,
  SAVE_AS_TEMPLATE,
  REDIRECT,
  MOVE_LAYER,
  GET_STORY_PAGES,
  SET_STORY_PAGES,
  SET_STORY_LAYER,
  COPY_FROM_TEMPLATE,
  UPDATED_LAYERS,
  GROUP,
  UNGROUP,
  USER_JOINED,
  USER_LEFT,
  PRESENCE,
  UNDO,
  REDO,
  UNDO_REDO,
  CLEAR_SELECTED_ELEMENTS,
  BROADCAST,
  ADDED_CURSOR_BROADCAST,
  ADDED_POINTER_BROADCAST,
  ADDED_EVENT_BROADCAST,
  UPDATE_LAYERS,
  UPDATE_STORY,
  UPDATE_ANIMATIONS,
  MOVE_ARTBOARD,
  UPDATED_STORY,
} from "../_actions/types";
import { clearErrors } from "../_actions/errorHandlerActions";
import { page, layer, group } from "./schema";
import { normalize } from "normalizr";
import {
  REMOTE_COLLOBORATION_BROADCAST_MOUSE_POINTER,
  REMOTE_COLLOBORATION_BROADCAST_TEXT_CURSOR,
  REMOTE_COLLOBORATION_BROADCAST_ACTION,
} from "../_components/details/constants";
import { setActivePage, setClonedItems } from "../_actions/textToolbarActions";
export const wsOpen = (host) => ({ type: WEBSOCKET_OPEN, host });
export const wsClosed = () => ({ type: WEBSOCKET_CLOSED });
export const addedNewLayer = (payload) => ({ type: ADDED_LAYER, payload });
export const addedNewLayers = (payload) => ({ type: ADDED_LAYERS, payload });
export const updatedLayer = (payload) => ({ type: UPDATED_LAYER, payload });
export const updatedLayers = (payload) => ({ type: UPDATED_LAYERS, payload });
export const userJoined = (payload) => ({ type: USER_JOINED, payload });
export const userLeft = (payload) => ({ type: USER_LEFT, payload });
export const managePresence = (payload) => ({ type: PRESENCE, payload });
export const undoRedo = (payload) => ({ type: UNDO_REDO, payload });

export const deletedLayers = (payload) => ({ type: DELETED_LAYERS, payload });
export const addedPage = (payload) => ({ type: ADDED_PAGE, payload });
export const addedPages = (payload) => ({ type: ADDED_PAGES, payload });
export const deletedPage = (payload) => (dispatch, getStore) => {
  let activePage = getStore().editor.activePage;
  let pageIds = getStore().pagestore.pageIds;
  const deletedPageId = payload.page;

  let activePageIndex = null;
  let activePageId = null;
  let shouldSetActivePage = false;

  if (activePage?.id === deletedPageId) {
    // If the deleted page is active then setActivePage accordingly
    const totalPages = pageIds.length;
    shouldSetActivePage = true;
    const deletedPageIndex = pageIds.indexOf(deletedPageId);
    if (deletedPageIndex !== null && deletedPageIndex !== undefined) {
      if (totalPages > deletedPageIndex + 1) {
        // If the Deleted page has next page
        activePageIndex = deletedPageIndex;
        activePageId = pageIds[deletedPageIndex + 1];
      } else {
        // If deleted page does not has next page
        activePageIndex = deletedPageIndex - 1;
        activePageId = pageIds[deletedPageIndex - 1];
      }
    }
  }

  dispatch({ type: DELETED_PAGE, payload });
  if (shouldSetActivePage) {
    dispatch(setActivePage(activePageId, activePageIndex, true));
  }
};
export const updatedPage = (payload) => ({ type: UPDATED_PAGE, payload });
export const updatedStory = (payload) => ({ type: UPDATED_STORY, payload });
export const wsStatusMessage = (payload) => ({
  type: WEBSOCKET_MESSAGE,
  payload,
});

export const setStoryPages = (payload) => ({
  type: SET_STORY_PAGES,
  payload,
});

export const setStoryLayers = (payload) => ({
  type: SET_STORY_LAYER,
  payload,
});

export const addedCursorBroadcast = (payload) => ({
  type: ADDED_CURSOR_BROADCAST,
  payload,
});

export const addedPointerBroadcast = (payload) => ({
  type: ADDED_POINTER_BROADCAST,
  payload,
});

export const addedEventBroadcast = (payload) => ({
  type: ADDED_EVENT_BROADCAST,
  payload,
});

const socketMiddleware = () => {
  let socket = null;
  const onSend = (store, message) => {
    store.dispatch(wsStatusMessage({ message: "Saving..." }));
    if (socket != null && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const onBroadcast = (store, message) => {
    if (socket != null && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  const onOpen = (store) => (event) => {
    if (socket != null) {
      store.dispatch(wsOpen(event.target.url));
    }
  };

  const onClose = (store) => () => {
    try {
      store.dispatch(wsClosed());
    } catch (error) {
      console.error("onclose, failed to dispatch");
    }
  };

  const onError = (store) => () => {
    try {
      store.dispatch(wsClosed());
    } catch (error) {
      console.error("onerror, failed to dispatch.");
    }
    //store.dispatch(wsStatusMessage("Trying to reconnect."));
    //clearInterval(reconnectionTimer);
    //reconnectionTimer = null;
  };

  const onMessage = (store) => (event) => {
    const response = JSON.parse(event.data);
    let snapshot = true;
    if (response.success === false) {
      store.dispatch(
        wsStatusMessage({
          message: "Failed to update, Try again.",
          snapshot: false,
        })
      );
      return;
    }
    // Add  will hande add and update functionlity.
    if (response.method === "add_layer") {
      const normalizedData = normalize(response.data, group);
      store.dispatch(addedNewLayer(normalizedData));
    } else if (response.method === "delete_layers") {
      store.dispatch(deletedLayers(response.data));
    } else if (response.method === "add_pages") {
      const normalizedData = normalize(response.data, [page]);
      store.dispatch(addedPages(normalizedData));

      let newPageId = normalizedData.result[0];
      let newPageOrder = normalizedData["entities"].pages[newPageId].order;
      store.dispatch(setActivePage(newPageId, newPageOrder, true));
    } else if (response.method === "add_page") {
      const normalizedData = normalize(response.data, page);
      store.dispatch(addedPage(normalizedData));
      store.dispatch(
        setActivePage(normalizedData.result, response.data.order, true)
      );
    } else if (response.method === "delete_page") {
      store.dispatch(deletedPage(response.data));
    } else if (response.method === "update_story") {
      batch(() => {
        store.dispatch(updatedStory(response.data));
      });
    } else if (response.method === "update_page") {
      broadcastPageUpdate(store, response.data);
    } else if (response.method === "update_pages") {
      const normalizedData = normalize(response.data, [page]);
      store.dispatch(setStoryPages(normalizedData));
    } else if (response.method === "update_layer") {
      //if(response.type !== 'ack'){
      broadcastLayerUpdate(store, response.data);
      //}
    } else if (response.method === "undo_redo") {
      store.dispatch(undoRedo(response.data));
      return;
    } else if (response.method === "presence") {
      snapshot = false;
      store.dispatch(managePresence(response.data));
    } else if (response.method === "broadcast") {
      if (response.data.type === REMOTE_COLLOBORATION_BROADCAST_TEXT_CURSOR) {
        store.dispatch(addedCursorBroadcast(response.data.data));
      } else if (
        response.data.type === REMOTE_COLLOBORATION_BROADCAST_MOUSE_POINTER
      ) {
        store.dispatch(addedPointerBroadcast(response.data.data));
      } else if (response.data.type === REMOTE_COLLOBORATION_BROADCAST_ACTION) {
        store.dispatch(addedEventBroadcast(response.data.data));
      }
    } else if (response.method === "clone_layers") {
      const normalizedData = normalize(response.data, [layer]);
      batch(() => {
        store.dispatch(addedNewLayers(normalizedData));
        store.dispatch(setClonedItems(normalizedData.result));
      });
    }
    store.dispatch(
      wsStatusMessage({
        message: snapshot ? "All changes are saved." : "Connected",
        snapshot: snapshot,
      })
    );
  };

  const broadcastLayerUpdate = (store, data) => {
    const normalizedData = normalize(data, layer);
    batch(() => {
      store.dispatch(updatedLayer(normalizedData));
      //store.dispatch(setClonedItems(null))
    });
  };

  const broadcastPageUpdate = (store, data) => {
    batch(() => {
      const normalizedData = normalize(data, page);
      let layers = {};
      if (normalizedData.entities.layers) {
        layers = normalizedData.entities.layers;
      }
      store.dispatch(updatedLayers(layers));
      store.dispatch(updatedPage(normalizedData));
    });
  };

  const normalizeAndBroadcast = (store, data) => {
    const normalizedData = normalize(data, [page]);
    batch(() => {
      let layers = { entities: { layers: {} } };
      if (normalizedData.entities.layers) {
        layers = normalizedData;
      }
      store.dispatch(setStoryLayers(layers));
      store.dispatch(setStoryPages(normalizedData));
    });
  };

  return (store) => (next) => (action) => {
    if (!action) {
      return next(action);
    }
    switch (action.type) {
      case GET_STORY_PAGES:
        normalizeAndBroadcast(store, action.payload.results);
        break;
      case REDIRECT:
        store.dispatch(clearErrors());
        const { data, props } = action.payload;
        props.history.push(data);
        break;
      case WEBSOCKET_CONNECT:
        if (socket !== null) {
          socket.close();
        }
        // connect to the remote host
        store.dispatch(wsStatusMessage({ message: "Connecting..." }));
        socket = new ReconnectingWebSocket(action.host);
        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);
        socket.onerror = onError(store);
        break;
      case WEBSOCKET_DISCONNECT:
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        break;
      case ADD_LAYER:
        let payload = action.payload;
        if (payload) {
          payload["page"] = action.pageId;
          var request = {
            method: "add_layer",
            message: payload,
          };
          onSend(store, request);
        }
        break;
      case BROADCAST:
        request = {
          method: "broadcast",
          message: action.payload,
        };
        onBroadcast(store, request);
        break;
      case UPDATE_LAYER:
        request = {
          method: "update_layer",
          message: action.payload,
        };
        onSend(store, request);
        break;
      case UPDATE_LAYERS:
        request = {
          method: "update_layers",
          message: {
            layers: action.layers,
            page: action.pageId,
          },
        };
        onSend(store, request);
        break;
      case DELETE_LAYERS:
        request = {
          method: "delete_layers",
          message: {
            layers: action.layerIds,
            page: action.pageId,
          },
        };
        onSend(store, request);
        break;
      case CLONE_LAYERS:
        request = {
          method: "clone_layers",
          message: {
            layers: action.layerIds,
            page: action.pageId,
          },
        };
        onSend(store, request);
        break;
      case ADD_PAGE:
        request = {
          method: "add_page",
          message: {
            layers: [],
            payload: {},
          },
        };
        onSend(store, request);
        break;
      case CLONE_PAGE:
        request = {
          method: "clone_page",
          message: {
            page: action.payload,
          },
        };
        onSend(store, request);
        break;
      case UPDATE_PAGE:
        request = {
          method: "update_page",
          message: action.payload,
        };
        onSend(store, request);
        break;
      case DELETE_PAGE:
        request = {
          method: "delete_page",
          message: {
            page: action.payload,
          },
        };
        onSend(store, request);
        break;
      case SAVE_AS_TEMPLATE:
        request = {
          method: "save_as_template",
          message: {
            page: action.payload,
          },
        };
        onSend(store, request);
        break;
      case MOVE_LAYER:
        request = {
          method: action.method,
          message: {
            layer: action.payload,
          },
        };
        onSend(store, request);
        break;
      case COPY_FROM_TEMPLATE:
        request = {
          method: "copy_from_template",
          message: {
            page: action.pageId,
            template: action.templateId,
          },
        };
        onSend(store, request);
        break;
      case GROUP:
        request = {
          method: "group",
          message: {
            page: action.pageId,
            layers: action.layers,
            group: action.group,
          },
        };
        onSend(store, request);
        // Clear selected elements after grouping
        store.dispatch({
          type: CLEAR_SELECTED_ELEMENTS,
        });
        break;
      case UNGROUP:
        request = {
          method: "ungroup",
          message: {
            groupId: action.layerId,
            layers: action.layers,
          },
        };
        onSend(store, request);
        break;
      case REDO:
        request = {
          method: "redo",
        };
        onSend(store, request);
        break;
      case UNDO:
        request = {
          method: "undo",
        };
        onSend(store, request);
        break;
      case UPDATE_STORY:
        request = {
          method: "update_story",
          message: action.payload,
        };
        onSend(store, request);
        break;
      case UPDATE_ANIMATIONS:
        request = {
          method: "update_animations",
          message: action.payload,
        };
        onSend(store, request);
        break;
      case MOVE_ARTBOARD:
        request = {
          method: "move_page",
          message: {
            page: action.pageId,
            destination: action.destinationIndex,
          },
        };
        onSend(store, request);
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
