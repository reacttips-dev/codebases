import axios from "axios";
import { FONTS_ENDPOINT, STORIES_FONTS_ENDPOINT } from "./endpoints";
import * as errorHandlerActions from "./errorHandlerActions";
import {
  GET_FONT_LIST,
  FONT_GET_ADDED,
  DELETE_FONT,
  FONTS_GET_ADDED,
  REMOVE_FONT_FROM_STATE,
} from "./types";
const format = require("string-format");

export const fetchFonts = (props, signalToken) => (dispatch) => {
  return axios
    .get(FONTS_ENDPOINT, {
      cancelToken: signalToken.token,
    })
    .then((res) => {
      dispatch(fetchedFonts(res.data.results));
      return res.data;
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const fetchStoryFonts = (storyId, signalToken, props) => (dispatch) => {
  return axios
    .get(format(STORIES_FONTS_ENDPOINT, storyId), {
      cancelToken: signalToken.token,
    })
    .then((res) => {
      dispatch(fontsGetAdded(res.data.results));
      return res.data;
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const fetchedFonts = (fonts) => {
  return {
    type: GET_FONT_LIST,
    payload: fonts || [],
  };
};

export const fontGetAdded = (fontInfo) => {
  return {
    type: FONT_GET_ADDED,
    payload: fontInfo,
  };
};

export const fontsGetAdded = (fonts) => {
  return {
    type: FONTS_GET_ADDED,
    payload: fonts,
  };
};
export const deleteFont = (id, props) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${FONTS_ENDPOINT}/${id}`)
      .then((res) => {
        dispatch({
          type: DELETE_FONT,
          payload: id,
        });
        resolve();
      })
      .catch((error) => {
        console.error("Delete font failed.\n", error);
        reject();
        // dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  });
};

export const removeFontFromState = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_FONT_FROM_STATE,
    payload: id,
  });
};
