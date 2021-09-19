// file for resuable functions within component class lifecycle hooks.  Ideally these would be true
// react hooks, but most of our components with logic in them are classes still.
import { deepEqual } from 'fast-equals';

import { logError, logToServer } from 'middleware/logger';
import { buildErrorQueryStringForMartyPixel, trackError } from 'helpers/ErrorUtils';

export function componentDidCatchFullPageError(setErrorActionCreator, error, info, { logError: logConsoleError, logToServer: logErrorToServer } = { logError, logToServer }) {
  const message = `[APP] An error has occurred while rendering the main page: ${error}`;
  logConsoleError(message);
  logConsoleError('More information', info);
  logErrorToServer(message);
  error.detailedMessage = message;
  setErrorActionCreator(message, error, 500);
}

export function trackErrorIfNew(prevError, newError) {
  if (!deepEqual(prevError, newError)) {
    trackError(newError.statusCode, newError.type, newError.event);
  }
}

export function trackErrorPageToMartyPixel(error, reduxConnectedTrackErrorToMartyPixel, trackToErrorCgi = trackError) {
  if (error) {
    const { statusCode, type, event } = error;
    trackToErrorCgi(statusCode, type, event);
    const msg = buildErrorQueryStringForMartyPixel(statusCode, type, event);
    reduxConnectedTrackErrorToMartyPixel(msg);
  }
}
