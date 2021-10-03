import { SHOW_COMMANDK_SEARCH, HIDE_COMMANDK_SEARCH } from "../_actions/types";

export const TO_SHOW_SEARCH = "open";
export const TO_HIDE_SEARCH = "close";

export const initialState = {
  isSearchShowing: TO_HIDE_SEARCH,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SHOW_COMMANDK_SEARCH:
      return {
        isSearchShowing: TO_SHOW_SEARCH,
      };
    case HIDE_COMMANDK_SEARCH:
      return {
        isSearchShowing: TO_HIDE_SEARCH,
      };
    default:
      return state;
  }
}
