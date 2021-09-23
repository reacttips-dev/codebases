'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import Raven from 'Raven';
import ScopesContainer from '../../containers/ScopesContainer';
/**
 * Hits the `login-verify/echo` endpoint to refresh auth status and scoeps.
 *
 * This method is a simple healthcheck from the auth backend that lets us
 * check the user's current auth status, as well as get new/changed scopes from
 * the backend. This ensures that even if a user's permissions change during a
 * session or the user gets logged out, they won't retain access to specific
 * features or, in the worst case, the entire app, when they're not authorized.
 *
 * While it can be called at any time, it's intended to be called on a polling
 * interval to keep the current user's auth status up to date.
 *
 * @example
 * setInterval(() => {
 *   loginVerifyEcho();
 * }, I18n.moment.duration(10, 'minutes').valueOf())
 */

export var loginVerifyEcho = function loginVerifyEcho() {
  return ImmutableAPI.get('/login-verify/echo').then(function (response) {
    var scopesArray = response.get('scopes').toJS();
    var scopes = scopesArray.reduce(function (acc, scope) {
      acc[scope] = true;
      return acc;
    }, {});
    ScopesContainer.set(scopes);
  }).catch(function (err) {
    return Raven.captureException(err);
  }).done();
};