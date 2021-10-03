import axios from "axios";
import {
  DELETE_DOCUMENTS_ENDPOINT,
  DOCUMENTS_ENDPOINT,
  FAVORITE_COPIES,
} from "./endpoints";
import { showToast } from "./toastActions";
import {
  DELETE_DOCUMENT,
  RESET_DOCUMENT,
  UPDATE_DOCUMENT,
  GET_DOCUMENTS,
} from "./types";
import { handleHTTPError } from "./errorHandlerActions";
import Format from "string-format";

const format = require("string-format");

export const updateDocument = (payload) => {
  return {
    type: UPDATE_DOCUMENT,
    payload: payload,
  };
};

export const resetDocument = () => {
  return {
    type: RESET_DOCUMENT,
  };
};

export const getDocuments = (props, search, signal) => (dispatch) => {
  let endpoint = DOCUMENTS_ENDPOINT;
  if (search) {
    endpoint = Format("{0}?search={1}", endpoint, search);
  }
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint, signal)
      .then((res) => {
        resolve(res.data);

        dispatch({
          type: GET_DOCUMENTS,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  });
};

export const getFavoriteCopies = (props, search, signal) => (dispatch) => {
  let endpoint = FAVORITE_COPIES;
  if (search) {
    endpoint = Format("{0}?search={1}", endpoint, search);
  }
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint, signal)
      .then((res) => {
        resolve(res.data);
        dispatch({
          type: GET_DOCUMENTS,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch(handleHTTPError(error, props));
      });
  });
};

export const deleteDocument = (documentId, signalToken) => (dispatch) => {
  dispatch(
    showToast({
      message: "Deleting selected document... ",
      heading: "Deleting document",
      type: "info",
    })
  );
  let data = { cancelToken: signalToken };
  return axios
    .delete(format(DELETE_DOCUMENTS_ENDPOINT, documentId), data)
    .then((res) => {
      dispatch({
        type: DELETE_DOCUMENT,
        payload: documentId,
      });
      dispatch(
        showToast({
          message: "Selected document has been deleted!",
          heading: "Success",
          type: "success",
        })
      );
      return res;
    })
    .catch((error) => {
      dispatch(
        showToast({
          message: "Failed to delete selected document.",
          heading: "Failed",
          type: "error",
        })
      );
      dispatch(handleHTTPError(error, documentId));
    });
};
