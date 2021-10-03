import { ADDED_POINTER_BROADCAST } from "../_actions/types";

const initialState = {
  //   pointer: { x: 0, y: 0},
  users: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADDED_POINTER_BROADCAST:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.user.pk]: {
            user: action.payload.user,
            pointer: action.payload.pointer,
          },
        },
      };
    default:
      return state;
  }
}
