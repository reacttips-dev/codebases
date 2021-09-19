import {
  REMOVE_COOKIE,
  SERIALIZE_STATE,
  SET_COOKIE
} from 'constants/reduxActions';

export default function cookies(state = {}, action) {
  const { type, cookie } = action;
  switch (type) {
    case SET_COOKIE:
      return { ...state, [cookie.name] : cookie.value };
    case REMOVE_COOKIE:
    {
      const newState = { ...state };
      delete newState[cookie.name];
      return newState;
    }
    case SERIALIZE_STATE:
      return {};
    default:
      return state;
  }
}
