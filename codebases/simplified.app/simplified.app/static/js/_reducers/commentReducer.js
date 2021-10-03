import { UPDATE_COMMENT_COUNT } from "../_actions/types";

const initialState = {
  commentCount: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_COMMENT_COUNT:
      return { ...state, commentCount: action.payload };

    default:
      return state;
  }
}
