import {
  SET_FOLDERS,
  RESET_FOLDERS_STATE,
  ADD_FOLDER,
  ADD_FOLDER_ITEMS,
  RENAME_FOLDER,
  REMOVE_FOLDER,
} from "./types";
import { FOLDERS_ENDPOINT, FOLDERS_SEARCH_ENDPOINT } from "./endpoints";
import axios from "axios";
import * as errorHandlerActions from "./errorHandlerActions";
import { showToast } from "./toastActions";

export const fetchFolders = (signalToken, props) => (dispatch) => {
  axios
    .get(FOLDERS_SEARCH_ENDPOINT, {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: SET_FOLDERS,
        payload: {
          data: res.data.results,
          hasMore: res.data.next !== null,
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const addFolder = (payload) => (dispatch) => {
  dispatch({
    type: ADD_FOLDER,
    payload: payload,
  });
};

export const addFolderItems = (payload) => (dispatch) => {
  dispatch({
    type: ADD_FOLDER_ITEMS,
    payload: payload,
  });
};

export const renameFolder = (payload) => (dispatch) => {
  dispatch({
    type: RENAME_FOLDER,
    payload: payload,
  });
};

export const removeFolder = (payload) => (dispatch) => {
  dispatch({
    type: REMOVE_FOLDER,
    payload: payload,
  });
};

export const resetFolders = () => (dispatch) => {
  dispatch({
    type: RESET_FOLDERS_STATE,
  });
};

export const createNewFolder = (name, signalToken) => (dispatch) => {
  const payload = {
    name,
  };

  return axios
    .post(FOLDERS_ENDPOINT, payload, {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: ADD_FOLDER,
        payload: res.data,
      });
      dispatch(
        showToast({
          message: "You did it! '" + name + "' created successfully.",
          heading: "Success",
          type: "success",
        })
      );
      return res.data;
    })
    .catch((error) => {
      dispatch(
        showToast({
          message:
            "Something went wrong while creating a new folder, please try again later.",
          heading: "Error",
          type: "error",
        })
      );
    });
};

export const moveToFolder =
  (folder, selectedCards, signalToken) => (dispatch) => {
    const payload = {
      content_ids: selectedCards.map((item) =>
        item.id ? item.id : item.content.meta.id
      ),
    };

    return axios
      .post(`${FOLDERS_ENDPOINT}/${folder.id}/add_contents`, payload, {
        cancelToken: signalToken,
      })
      .then((res) => {
        dispatch(
          showToast({
            message: `Items added to the "${folder.name}"`,
            heading: "Success",
            type: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            message:
              "Something went wrong while adding items to the folder, please try again later.",
            heading: "Error",
            type: "error",
          })
        );
      });
  };
