/* eslint-disable
    eqeqeq,
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const Backbone = require('@trello/backbone');
const { googleDriveClientId } = require('@trello/config');

class GoogleApi {
  static loadedAuth() {
    // If the script is loaded, gapi should be in the window scope
    // If it isn't, then something went wrong (perhaps it was blocked by an
    // extension or something)
    return window.gapi?.load('auth', () => {
      this.loaded = true;
      this.trigger('loaded');
      return this.authorize(true);
    });
  }

  static authorize(immediate, next) {
    // If we have a valid token, use it
    if (this.validToken()) {
      return typeof next === 'function'
        ? next(null, this.oauthToken.access_token)
        : undefined;
    }

    // The immediate flag will try the authorize in the background and will not
    // prompt the user if it fails. This allows us to avoid a popup for users
    // that have already granted access to Trello.
    return gapi.auth.authorize(
      {
        client_id: googleDriveClientId,
        scope:
          'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file',
        immediate,
      },
      (result) => {
        if (!result || result.error) {
          this.oauthToken = null;
          return typeof next === 'function'
            ? next(result?.error ?? Error('Failed to request token'))
            : undefined;
        }

        this.oauthToken = result;

        return typeof next === 'function'
          ? next(null, this.oauthToken.access_token)
          : undefined;
      },
    );
  }

  static validToken() {
    // Token must exist and not have expired
    return (
      this.oauthToken?.access_token &&
      // eslint-disable-next-line radix
      Date.now() / 1000 < parseInt(this.oauthToken.expires_at)
    );
  }
}

_.extend(GoogleApi, Backbone.Events);

module.exports.GoogleApi = GoogleApi;
