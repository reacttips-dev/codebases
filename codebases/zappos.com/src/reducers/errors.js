import { LOCATION_CHANGE } from 'react-router-redux';

import { RENDER_ERROR, RESET_ERROR, SET_ERROR } from 'constants/reduxActions';
import { toRelativeUrlString } from 'helpers/LocationUtils';

function buildLocationChecksum(location) {
  return location && toRelativeUrlString(location);
}

// Updates error message to notify about the failed fetches.
export function error(state = null, action) {
  const { type, errorEvent, errorMessage, errorType, location, payload, statusCode } = action;

  switch (type) {
    case SET_ERROR:
      return {
        message: errorMessage,
        event: errorEvent,
        route: buildLocationChecksum(location),
        type: errorType,
        statusCode
      };
    case LOCATION_CHANGE:
      const newLocation = buildLocationChecksum(payload);
      if (newLocation === (state && state.route)) {
        return state;
      } else {
        return null;
      }
    case RESET_ERROR:
      return null;
    case RENDER_ERROR:
      // this is a special action which indicates the server could not render the existing component state and the server output needs to get thrown out prior to render.
      // It's very bad and hopefully never happens in production (outside of /s/e/c/r/e/t/r/o/u/t/e)
      return {
        type: RENDER_ERROR,
        route: buildLocationChecksum(location),
        event: errorEvent
      };
    default:
      return state;
  }
}
