import { Map } from "immutable";
import {
  ADDED_LAYER,
  SET_STORY_LAYER,
  DELETED_LAYERS,
  UPDATED_LAYER,
  ADDED_PAGE,
  LAYER_ACTION_STARTED,
  BACK_FROM_STUDIO,
  UPDATED_LAYERS,
  UPDATE_LAYER_PAYLOAD,
  ADDED_LAYERS,
  ADDED_PAGES,
} from "../_actions/types";

const initialState = {
  layers: {},
  loaded: false,
  isEmpty: false,
  lastUpdated: null,
};

const layersReducer = (state = initialState, action) => {
  switch (action.type) {
    case BACK_FROM_STUDIO:
      return initialState;
    case SET_STORY_LAYER:
      return {
        layers: action.payload.entities.layers,
        loaded: true,
        isEmpty: action.payload.entities.layers.length > 0,
        lastUpdated: Date.now(),
      };
    case ADDED_PAGES:
    case ADDED_PAGE:
    case ADDED_LAYERS:
    case ADDED_LAYER:
      let newMap = Map(state.layers)
        .merge(action.payload.entities.layers)
        .toJS();
      return {
        ...state,
        loaded: true,
        layers: newMap,
        lastUpdated: Date.now(),
      };
    case DELETED_LAYERS:
      let newLayersMap = Map(state.layers);
      action.payload.layers.forEach((idToDelete) => {
        newLayersMap = newLayersMap.delete(idToDelete);
      });
      const newState = {
        ...state,
        layers: newLayersMap.toJS(),
        lastUpdated: Date.now(),
      };
      return newState;
    case UPDATED_LAYER:
      const layerId = action.payload.result;
      return {
        ...state,
        lastUpdated: Date.now(),
        layers: {
          ...state.layers,
          [layerId]: {
            ...action.payload.entities.layers[layerId],
          },
        },
      };
    case UPDATE_LAYER_PAYLOAD:
      return {
        ...state,
        lastUpdated: Date.now(),
        layers: {
          ...state.layers,
          [action.payload.layer]: {
            ...state.layers[action.payload.layer],
            payload: action.payload.payload,
          },
        },
      };
    case LAYER_ACTION_STARTED:
      return {
        ...state,
        loaded: false,
      };

    case UPDATED_LAYERS:
      const updatedLayers = Map(state.layers).merge(action.payload).toJS();
      return {
        ...state,
        loaded: true,
        lastUpdated: Date.now(),
        layers: updatedLayers,
      };
    default:
      return state;
  }
};

export default layersReducer;
