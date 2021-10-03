import { GET_CATEGORIES } from "../_actions/types";

const initialState = {
  payload: [],
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        payload: action.payload,
        loaded: true,
      };
    default:
      return state;
  }
}
