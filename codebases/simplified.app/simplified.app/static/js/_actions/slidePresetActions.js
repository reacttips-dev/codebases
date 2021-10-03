import axios from "axios";
import Format from "string-format";
import { CATEGORY_FORMAT } from "../_components/details/constants";
import {
  FETCH_CATEGORIES,
  FETCH_FORMATS,
  SEARCH_PROJECT_FORMATS_ENDPOINT,
} from "./endpoints";
import { handleHTTPError } from "./errorHandlerActions";
import { GET_SLIDE_PRESET_CATEGORIES, GET_SLIDE_PRESETS } from "./types";

export const fetchCategories = (props, signalToken) => (dispatch) => {
  axios
    .get(Format(FETCH_CATEGORIES, CATEGORY_FORMAT), {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: GET_SLIDE_PRESET_CATEGORIES,
        payload: res.data.results,
      });
    })
    .catch((error) => {
      dispatch(handleHTTPError(error, props));
    });
};

export const fetchFormats = (key = "", props) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(Format(FETCH_FORMATS, key))
      .then((res) => {
        resolve(res.data);

        dispatch({
          type: GET_SLIDE_PRESETS,
          payload: res.data.results,
        });
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  });
};

export const searchFormats = (searchTerm, props) => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(Format(SEARCH_PROJECT_FORMATS_ENDPOINT, searchTerm))
      .then((res) => {
        resolve(res.data);

        dispatch({
          type: GET_SLIDE_PRESETS,
          payload: res.data.results,
        });
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  });
};
