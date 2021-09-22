/**
 * An updated version of 204.js configured to push v2 schema-validated events.
 *
 * Although the eventing server is configured to return 400 BAD REQUESTs for non-conformant
 * events, this library only supports error handling for GET-pushed events. POSTs will fail
 * silently due to cross-origin access restrictions. Thus, it's recommended you monitor the
 * health of your pipeline using Sumologic (to check for errors) or BigQuery (to check that
 * v2 events are properly received)
 *
 * Usage:
 * 1. Register with the multitracker:
 * multitracker.register('400', window._400 = window._400 || [], 'key-value');
 *
 * 2. Initialize with your app name and the version. This is example usage in the multitracker singleton:
 * require(['js/lib/400', 'js/app/config'], function(_400, config) {
 *  if (_400) {
 *    multitracker.get('400').queue = _400;
 *     multitracker.get('400').queue.push(['clientVersion', config.version]);
 *  }
 * });
 *
 * 3. Registering the app name sometimes can't happen in the multitracker singleton
 *    because it is used by multiple apps, so you may have to initialize the app name later:
 * multitracker.get('400').queue.push(['app', 'phoenix']);
 *
 * 4. Use by by pushing to the multitracker with .pushV2:
 * Multitracker.pushV2([fullEventKey, finalValue]);
 */

import FourHundred from 'bundles/page/lib/FourHundred';
import cookie from 'js/lib/cookie';
import { ping, postIframe, post } from 'js/lib/eventingRequests';

let _400;
if (typeof window === 'undefined') {
  // no client event logging in server context
  const identity = (x) => x;
  const stub = {};
  Object.keys(FourHundred.prototype).forEach((name) => (stub[name] = identity));
  _400 = stub;
} else {
  _400 = new FourHundred(ping, postIframe, post);
}

export default _400;
// for backwards compatibility with Mocha
// TODO refactor test too
export { cookie };
