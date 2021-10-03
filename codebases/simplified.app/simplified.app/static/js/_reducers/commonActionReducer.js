import { UNDO_REDO } from "../_actions/types";

const initialState = {
  undo: false,
  redo: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UNDO_REDO:
      return {
        undo: action.payload.undo > 0,
        redo: action.payload.redo > 0,
      };
    default:
      return state;
  }
}
