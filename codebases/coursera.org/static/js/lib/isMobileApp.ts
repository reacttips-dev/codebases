/**
 * Coursera Mobile Apps can embed webpages into their mobile app. Access via this method is
 * designated by a cookie. This exists as a utility to check for that cookie.
 */

// loads cookie.server on the server
import cookie from 'js/lib/cookie';

const COOKIE_NAME = 'IS_MOBILE_APP';

export default {
  get(): boolean {
    return cookie.get(COOKIE_NAME) === 'true';
  },
};
