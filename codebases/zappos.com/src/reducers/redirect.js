import { LOCATION_CHANGE } from 'react-router-redux';

import { REDIRECT, SERIALIZE_STATE } from 'constants/reduxActions';

export default function redirect(state = {}, action) {
  const { type, location, status } = action;
  switch (type) {
    case REDIRECT:
      return { location, status: status || 302 };
    case LOCATION_CHANGE:
    case SERIALIZE_STATE:
      return {};
    default:
      return state;
  }
}
