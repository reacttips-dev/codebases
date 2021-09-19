/**
 * Middleware for handling server/client relationships
 */
import { LOCATION_ASSIGN, LOCATION_REPLACE } from 'constants/appConstants';
import { REDIRECT, REMOVE_COOKIE, SET_COOKIE } from 'constants/reduxActions';
import { removeCookie, setCookie } from 'helpers';
import { logDebug } from 'middleware/logger';

export const computeBaseUrl = () => {
  const { location: { protocol, host } } = window;
  return `${protocol}//${host}`;
};

export const browserMetadataMiddlewareFactory = history => {
  const baseUrl = computeBaseUrl();
  return () => next => action => {
    const { type, location, cookie } = action;
    let { method } = action;
    switch (type) {
      case REDIRECT:
      {
        method = method || LOCATION_REPLACE;
        const interpolatedLocation = location.replace('{{applicationBaseUrl}}', baseUrl);
        if (/^http/.test(interpolatedLocation)) {
          if (method === LOCATION_ASSIGN) {
            window.location.assign(interpolatedLocation);
          } else {
            if (method !== LOCATION_REPLACE) {
              logDebug(`Unknown redirect method "${method}". Defaulting to replace`);
            }
            window.location.replace(interpolatedLocation);
          }
        } else {
          // when redirecting across stack boundaries we want to force refresh if the page isn't client routed.
          if (method !== LOCATION_REPLACE) {
            logDebug(`The redirect method "${method}" is not supported for SmartHistory`);
          }
          history.smartReplacePreserveAppRoot(interpolatedLocation);
        }

        break;
      }
      case SET_COOKIE:
      {
        setCookie(cookie.name, cookie.value, { 'encode': cookie.options.encode || (f => f), 'path': '/', 'domain': cookie.options.domain, 'expires': cookie.options.expires });
        break;
      }
      case REMOVE_COOKIE:
      {
        removeCookie(cookie.name, cookie.domain);
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};
