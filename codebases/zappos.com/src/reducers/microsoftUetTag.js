import {
  CLEAR_STORED_MICROSOFT_UET_EVENTS,
  SET_MICROSOFT_UET_TAG_LOADED,
  STORE_MICROSOFT_UET_EVENT
} from 'constants/reduxActions';

export default function microsoftUetTagReducer(state = { loaded: false, events: [] }, action) {
  const { event, loaded, type } = action;
  switch (type) {
    case CLEAR_STORED_MICROSOFT_UET_EVENTS:
      return { ...state, events: [] };
    case SET_MICROSOFT_UET_TAG_LOADED:
      return { ...state, loaded };
    case STORE_MICROSOFT_UET_EVENT:
      return { ...state, events: [...state.events, event] };
    default:
      return state;
  }
}
