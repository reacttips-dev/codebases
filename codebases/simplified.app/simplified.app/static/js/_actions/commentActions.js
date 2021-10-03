import { UPDATE_COMMENT_COUNT } from "./types";

export const updateCommentCount = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_COMMENT_COUNT,
    payload: payload,
  });
};
