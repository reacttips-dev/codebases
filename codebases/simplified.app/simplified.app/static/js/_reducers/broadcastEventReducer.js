import {
  ADDED_EVENT_BROADCAST,
  UNFOLLOW_USER,
  FOLLOW_USER,
} from "../_actions/types";

const initialState = {
  event: {},
  user: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FOLLOW_USER:
      return {
        user: action.payload,
        event: {},
      };
    case UNFOLLOW_USER:
      return initialState;
    case ADDED_EVENT_BROADCAST:
      return {
        ...state,
        event:
          action.payload.user.pk === state.user.pk ? action.payload.event : {},
      };
    default:
      return state;
  }
}
