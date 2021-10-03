import axios from "axios";
import Format from "string-format";
import { analyticsTrackEvent, getHeightAndWidth } from "../_utils/common";
import {
  CREATE_BRANDKIT,
  CREATE_BRANDKIT_COLOR_PALLETE,
  CREATE_BRANDKIT_LOGOS,
  DELETE_BRANDKIT,
  DELETE_BRANDKIT_LOGO,
  GET_S3_SIGNED_URL_ENDPOINT,
  LIST_BRANDKITS,
  UPDATE_BRANDKIT,
  UPDATE_BRANDKIT_COLOR_PALETTE,
} from "./endpoints";
import * as errorHandlerActions from "./errorHandlerActions";
import {
  ADD_BRANDKIT,
  ADD_BRANDKIT_LOGOS,
  DELETED_BRANDKIT,
  DELETED_BRANDKIT_LOGOS,
  GET_BRANDKITS,
  SWITCH_BRANDKIT,
  UPDATED_BRANDKIT,
  UPDATED_BRANDKIT_PALETTES,
} from "./types";

export const fetchBrandKits = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    axios
      .get(LIST_BRANDKITS)
      .then((res) => {
        dispatch({
          type: GET_BRANDKITS,
          payload: res.data,
        });

        // Return brandkits
        resolve(res.data.results);
      })
      .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
  });
};

export const addBrandKit = (count, signalToken) => (dispatch) => {
  axios
    .post(
      CREATE_BRANDKIT,
      { title: `brandkit ${count + 1}` },
      { cancelToken: signalToken.token }
    )
    .then((res) => {
      if (res.status === 201) {
        analyticsTrackEvent("createBrandKit");
        dispatch({
          type: ADD_BRANDKIT,
          payload: res.data.id,
        });
        dispatch(fetchBrandKits());
      }
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

export const updateBrandKit = (id, newValue, signalToken) => (dispatch) => {
  axios
    .put(
      Format(UPDATE_BRANDKIT, id),
      { title: newValue },
      { cancelToken: signalToken.token }
    )
    .then((res) => {
      analyticsTrackEvent("updateBrandKit");
      if (res.status === 200) {
        dispatch({
          type: UPDATED_BRANDKIT,
          payload: res.data,
        });
        dispatch(fetchBrandKits());
      }
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

export const deleteBrandKit = (id, signalToken) => (dispatch) => {
  axios
    .delete(Format(DELETE_BRANDKIT, id), { cancelToken: signalToken.token })
    .then((res) => {
      analyticsTrackEvent("deletedBrandKit");
      if (res.status === 204) {
        dispatch({
          type: DELETED_BRANDKIT,
          payload: id,
        });
      }
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

export const addColorPalette = (id, signalToken) => (dispatch) => {
  axios
    .post(
      Format(CREATE_BRANDKIT_COLOR_PALLETE, id),
      {
        colors: [
          { rgb: "rgb(255, 255, 255)" },
          { rgb: "rgb(91, 192, 235)" },
          { rgb: "rgb(253, 231, 76)" },
          { rgb: "rgb(155, 197, 61)" },
          { rgb: "rgb(195, 66, 63)" },
          { rgb: "rgb(33, 26, 30)" },
        ],
      },
      { cancelToken: signalToken.token }
    )
    .then((res) => {
      if (res.status === 201) {
        dispatch(fetchBrandKits(id));
      }
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

export const updateColorPalette =
  (brandId, paletteId, body, signalToken) => (dispatch) => {
    axios
      .put(Format(UPDATE_BRANDKIT_COLOR_PALETTE, brandId, paletteId), body, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: UPDATED_BRANDKIT_PALETTES,
            payload: res.data,
          });
        }
      })
      .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
  };

export const uploadLogoFile = (file, brandKitId, signalToken) => (dispatch) => {
  getHeightAndWidth(file)
    .then((size) => {
      return axios.post(
        GET_S3_SIGNED_URL_ENDPOINT,
        {
          filename: file.name,
          filetype: file.type,
          action: "assets",
        },
        {
          cancelToken: signalToken.token,
        }
      );
    })
    .then((response) => {
      return uploadToS3(response, file);
    })
    .then((response) => {
      return axios.post(Format(CREATE_BRANDKIT_LOGOS, brandKitId), {
        image: response.data.asset,
      });
    })
    .then((response) => {
      dispatch({
        type: ADD_BRANDKIT_LOGOS,
        payload: response.data,
        counter: 1,
      });
      dispatch(fetchBrandKits());
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

const uploadToS3 = async (request, file) => {
  const requestOptions = {
    method: "PUT",
    body: file,
  };
  let response = await fetch(request.data.signed, requestOptions);
  if (response.ok) {
    return request;
  } else {
    return Promise.reject(response);
  }
};

export const deleteLogo = (brandKitId, logoId, signalToken) => (dispatch) => {
  axios
    .delete(Format(DELETE_BRANDKIT_LOGO, brandKitId, logoId), {
      cancelToken: signalToken.token,
    })
    .then((res) => {
      if (res.status === 204) {
        dispatch({
          type: DELETED_BRANDKIT_LOGOS,
          payload: logoId,
        });
        dispatch(fetchBrandKits());
      }
    })
    .catch((error) => dispatch(errorHandlerActions.handleHTTPError(error)));
};

export const switchBrandkit = (brandkitId) => (dispatch) => {
  dispatch({
    type: SWITCH_BRANDKIT,
    payload: brandkitId,
  });
};
