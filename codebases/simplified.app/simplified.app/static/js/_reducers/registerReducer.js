import { USER_VERIFIED } from "../_actions/types";

const initialState = {
  isVerified: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_VERIFIED:
      return {
        ...state,
        isVerified: true,
      };
    default:
      return state;
  }
}
