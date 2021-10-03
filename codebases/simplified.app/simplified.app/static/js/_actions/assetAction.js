import axios from "axios";
import { CHECK_TASK_STATAUS, ASSETS_ENDPOINT } from "./endpoints";
import * as errorHandlerActions from "./errorHandlerActions";
import { ADD_ASSETS } from "./types";
const format = require("string-format");

export const checkAssetStatus = (assetId, props, signalToken) => (dispatch) => {
  const timer = setInterval(() => {
    axios
      .get(format(CHECK_TASK_STATAUS, assetId), {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        if (res.data.status === "SUCCESS") {
          axios.get(ASSETS_ENDPOINT + `/${assetId}`).then((res) => {
            dispatch({
              type: ADD_ASSETS,
              payload: res.data,
            });
            clearInterval(timer);
          });
        }
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  }, 5000);
};
