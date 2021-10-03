import { ADDED_CURSOR_BROADCAST } from "../_actions/types";

const initialState = {
  cursors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADDED_CURSOR_BROADCAST:
      return {
        ...state,
        cursors: {
          ...state.cursors,
          [action.payload.id]: {
            [action.payload.user.pk]: action.payload,
          },
        },
      };
    default:
      return state;
  }
}
