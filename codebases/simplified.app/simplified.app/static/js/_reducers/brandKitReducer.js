import {
  ADD_BRANDKIT,
  DELETED_BRANDKIT,
  UPDATED_BRANDKIT_PALETTES,
  GET_BRANDKITS,
  GET_BRANDKIT_LOGOS,
  GET_BRANDKIT_PALETTES,
  UPDATED_BRANDKIT,
  DELETED_BRANDKIT_LOGOS,
  ADD_BRANDKIT_LOGOS,
  SWITCH_BRANDKIT,
} from "../_actions/types";
import { findIndex } from "lodash";

export const initialState = {
  loaded: false,
  brandkitPayload: [],
  brandkitsCount: 0,
  brandKitIds: [],
  palettePayload: [],
  palettesCount: 0,
  paletteIds: [],
  logosPayload: [],
  logosCount: 0,
  selectedBrandkit: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_BRANDKIT:
      return {
        ...state,
        loaded: true,
        brandKitIds: state.brandKitIds.concat(action.payload),
      };
    case GET_BRANDKITS:
      return {
        ...state,
        loaded: true,
        brandkitPayload: action.payload.results,
        brandkitsCount: action.payload.count,
      };
    case DELETED_BRANDKIT:
      return {
        ...state,
        brandkitPayload: state.brandkitPayload.filter(
          (brandkit) => brandkit.id !== action.payload
        ),
        brandkitsCount: state.brandkitsCount - 1,
        brandKitIds: state.brandKitIds.filter(
          (brandkitId) => brandkitId !== action.payload
        ),
      };
    case UPDATED_BRANDKIT:
      var brandIndex = findIndex(state.brandkitPayload, (b) => {
        return b.id === action.payload.id;
      });
      return {
        ...state,
        loaded: true,
        brandkitPayload: state.brandkitPayload.splice(
          brandIndex,
          1,
          action.payload
        ),
      };
    case GET_BRANDKIT_PALETTES:
      return {
        ...state,
        loaded: true,
        palettePayload: action.payload.results,
        palettesCount: action.payload.count,
      };
    case UPDATED_BRANDKIT_PALETTES:
      return {
        ...state,
        loaded: true,
        palettePayload: action.payload.colors,
        palettesCount: action.payload.count,
      };
    case GET_BRANDKIT_LOGOS:
      return {
        ...state,
        loaded: true,
        logosPayload: action.payload.results,
        logosCount: action.payload.count,
      };
    case ADD_BRANDKIT_LOGOS:
      return {
        ...state,
        loaded: true,
        logosPayload: state.logosPayload.concat(action.payload),
        logosCount: state.logosCount + 1,
      };
    case DELETED_BRANDKIT_LOGOS:
      return {
        ...state,
        loaded: true,
        logosCount: state.logosCount - 1,
        logosPayload: state.logosPayload.filter(
          (brandLogo) => brandLogo.id !== action.payload
        ),
      };
    case SWITCH_BRANDKIT:
      return {
        ...state,
        selectedBrandkit: action.payload,
      };
    default:
      return state;
  }
}
