import { BACK_FROM_STUDIO, REDIRECT } from "./types";

export const backToDashboard = (props) => (dispatch) => {
  dispatch({
    type: BACK_FROM_STUDIO,
  });
  //dispatch(disconnect(WEBSOCKET_PREFIX));
};

// action creators
export const redirect = (data, props) => {
  return { type: REDIRECT, payload: { data: data, props: props } };
};
