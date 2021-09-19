import { AUTOCOMPLETE_CLEAR, AUTOCOMPLETE_UNREGISTER, AUTOCOMPLETE_UPDATE } from 'constants/reduxActions';

// Updates error message to notify about the failed fetches.
export default function autoComplete(state = {}, action) {
  const { type, id, text, data } = action;
  const newState = { ...state };
  switch (type) {
    case AUTOCOMPLETE_CLEAR:
      return { ...state, [id]: { values: null } };
    case AUTOCOMPLETE_UNREGISTER:
      delete newState[id];
      return newState;
    case AUTOCOMPLETE_UPDATE:
      return { ...state, [id]: { text, values: data } };
    default:
      return state;
  }
}
