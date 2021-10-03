import { TOAST_MESSAGE, CLOSE_TOAST } from "./types";

export const showToast = (payload) => (dispatch) => {
  dispatch({
    type: TOAST_MESSAGE,
    payload: payload,
  });
};

export const closeToast = (toastKey) => (dispatch) => {
  dispatch({
    type: CLOSE_TOAST,
    payload: {
      key: toastKey,
    },
  });
};
