import {
  BACK_FROM_STUDIO,
  ADDED_LAYER,
  ADDED_LAYERS,
  ADDED_PAGE,
  DELETED_PAGE,
  DELETED_LAYERS,
  UPDATED_PAGE,
  SET_STORY_PAGES,
  ADDED_PAGES,
} from "../_actions/types";
import { Map } from "immutable";

const initialState = {
  pages: [],
  pageIds: [],
  loaded: false,
};

const storyPagesReducer = (state = initialState, action) => {
  let pageId = null;
  switch (action.type) {
    case BACK_FROM_STUDIO:
      return initialState;
    case SET_STORY_PAGES:
      return {
        pages: action.payload.entities.pages
          ? action.payload.entities.pages
          : [],
        pageIds: action.payload.result,
        loaded: true,
      };

    case ADDED_PAGES:
      const updatedPages = Map(state.pages)
        .merge(action.payload.entities.pages)
        .toJS();
      return {
        ...state,
        pageIds: state.pageIds.concat(action.payload.result),
        pages: updatedPages,
      };

    case ADDED_PAGE:
      return {
        ...state,
        pageIds: state.pageIds.concat(action.payload.result),
        pages: {
          ...state.pages,
          [action.payload.result]: {
            ...action.payload.entities.pages[action.payload.result],
          },
        },
      };

    case DELETED_PAGE:
      const newState = {
        ...state,
        pageIds: state.pageIds.filter(
          (pageId) => pageId !== action.payload.page
        ),
      };
      delete newState.pages[action.payload.page]; // deletes property with key
      return newState;

    case UPDATED_PAGE:
      pageId = action.payload.result;
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...action.payload.entities.pages[pageId],
          },
        },
      };

    case ADDED_LAYER:
      const layerId = action.payload.result;
      pageId = action.payload.entities.layers[layerId].page;
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...state.pages[pageId],
            layers: state.pages[pageId].layers.concat(action.payload.result),
          },
        },
      };

    case ADDED_LAYERS:
      const layerIds = action.payload.result;
      pageId = action.payload.entities.layers[layerIds[0]].page;
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...state.pages[pageId],
            layers: state.pages[pageId].layers.concat(layerIds),
          },
        },
      };

    case DELETED_LAYERS:
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.payload.page]: {
            ...state.pages[action.payload.page],
            layers: state.pages[action.payload.page].layers.filter(
              (layerId) => !action.payload.layers.includes(layerId)
            ),
          },
        },
      };
    default:
      return state;
  }
};

export default storyPagesReducer;
