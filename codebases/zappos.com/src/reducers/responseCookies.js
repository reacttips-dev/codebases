import { SERIALIZE_STATE, SET_COOKIE } from 'constants/reduxActions';

const initialState = [];

export default function responseCookies(state = initialState, action) {
  const { type, cookie } = action;
  switch (type) {
    case SET_COOKIE:
      const isSet = state.some(c => c.name === cookie.name);

      if (!isSet) {
        return [...state, cookie];
      } else {
        return state;
      }
    case SERIALIZE_STATE:
      return initialState;
    default:
      return state;
  }
}
