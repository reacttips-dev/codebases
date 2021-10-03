import {
  GET_STORY,
  RESET_STORIES,
  UPDATED_STORY,
  UPDATE_STORY_MUSIC,
} from "../_actions/types";
import { getNormalFontSize } from "../_utils/common";

const initialState = {
  payload: {},
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_STORIES:
      return initialState;
    case GET_STORY:
      const contentSize = {
        width: action.payload.image_width,
        height: action.payload.image_height,
      };
      return {
        ...state,
        payload: action.payload,
        loaded: true,
        contentSize: contentSize,
        fontSize: getNormalFontSize(contentSize),
      };
    case UPDATED_STORY:
      return {
        ...state,
        payload: action.payload,
      };
    case UPDATE_STORY_MUSIC:
      return {
        ...state,
        payload: {
          ...state.payload,
          payload: {
            ...state.payload.payload,
            music: action.payload,
          },
        },
      };
    default:
      return state;
  }
}
