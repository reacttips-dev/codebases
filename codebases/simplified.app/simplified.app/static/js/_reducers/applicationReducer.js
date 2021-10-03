import {
  GET_FONT_LIST,
  FONT_GET_ADDED,
  DELETE_FONT,
  FONTS_GET_ADDED,
  REMOVE_FONT_FROM_STATE,
} from "../_actions/types";
import { findIndex } from "lodash";

const initialState = {
  fonts: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_FONT_LIST:
      return { ...state, fonts: action.payload };
    case FONT_GET_ADDED:
      let fonts = state.fonts;

      const newFont = action.payload;
      const fontIndex = findIndex(fonts, ["id", newFont.id]);

      if (fontIndex > -1) {
        fonts[fontIndex] = newFont;
        return { ...state, fonts };
      }
      return { ...state, fonts: [action.payload].concat(fonts) };
    case FONTS_GET_ADDED:
      let existFonts = state.fonts || [];
      const newFonts = action.payload;
      newFonts.forEach((newFont, index) => {
        const fontIndex = findIndex(existFonts, ["id", newFont.id]);
        if (fontIndex > -1) {
          existFonts[fontIndex] = newFont;
        } else {
          existFonts.push(newFont);
        }
      });
      return { ...state, fonts: existFonts };
    case DELETE_FONT:
    case REMOVE_FONT_FROM_STATE:
      return {
        ...state,
        fonts: state.fonts.filter((item, index) => action.payload !== item.id),
      };
    default:
      return state;
  }
}
