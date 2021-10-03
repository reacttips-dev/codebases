import { USER_LEFT, USER_JOINED, PRESENCE } from "../_actions/types";

const initialState = {
  users: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PRESENCE:
      return {
        users: action.payload,
      };
    case USER_JOINED:
      return {
        users: {
          ...state.users,
          [action.payload.pk]: {
            ...action.payload,
          },
        },
      };
    case USER_LEFT:
      const newState = {
        ...state,
      };
      delete newState.users[action.payload.pk]; // deletes property with key
      return newState;
    default:
      return state;
  }
}
