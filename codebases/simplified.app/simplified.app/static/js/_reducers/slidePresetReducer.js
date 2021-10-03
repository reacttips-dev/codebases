import {
  GET_SLIDE_PRESET_CATEGORIES,
  GET_SLIDE_PRESETS,
} from "../_actions/types";

const initialState = {
  presetCategories: [],
  presets: [],
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SLIDE_PRESET_CATEGORIES:
      return {
        ...state,
        loaded: true,
        presetCategories: action.payload,
      };
    case GET_SLIDE_PRESETS:
      return {
        ...state,
        loaded: true,
        presets: action.payload,
      };
    default:
      return state;
  }
}
