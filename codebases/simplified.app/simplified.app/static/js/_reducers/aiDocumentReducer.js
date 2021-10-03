import {
  UPDATE_DOCUMENT,
  RESET_DOCUMENT,
  DELETE_DOCUMENT,
  GET_DOCUMENTS,
} from "../_actions/types";

const initialState = {
  payload: [],
  data: {},
  loaded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case RESET_DOCUMENT:
      return initialState;
    case GET_DOCUMENTS:
      let payload =
        action.payload.next !== null
          ? state.payload.concat(action.payload.results)
          : action.payload.results;
      return {
        ...state,
        payload: payload,
      };
    case UPDATE_DOCUMENT:
      return {
        data: action.payload,
        loaded: true,
      };
    case DELETE_DOCUMENT:
      return {
        ...state,
        payload: state.payload.filter((doc) => doc.id !== action.payload),
      };
    default:
      return state;
  }
}
