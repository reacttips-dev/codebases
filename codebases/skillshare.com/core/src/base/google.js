import adapter from 'core/src/base/remote-script-adapter';
import Utils from 'core/src/base/utils';

const clientId = '281295984696-b1i9mp3r2qnpgd80rplqig1so711j1an.apps.googleusercontent.com';
const scopes = 'https://www.google.com/m8/feeds'; // Google contacts scope

const Google = {

  init: function(gapi) {
    this.gapi = gapi;
    Google.loaded.resolve(this);
  },

  // Ask the user to authorize with Google
  // Need to check if the user is already authorized so they don’t have to re-authorize every time
  authorize: function() {
    const deferred = $.Deferred();

    const callback = (authResult) => {
      if (authResult && !authResult.error) {
        this.authResult = authResult;
        deferred.resolve(authResult);
      } else {
        deferred.reject();
      }
    };

    this.gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: false }, callback);

    return deferred;
  },

  // Helper to hit a Google API endpoint (passes along the access token)
  makeRequest: function(endpoint, options = {}, type) {
    const deferred = $.Deferred();
    options.access_token = this.authResult.access_token;

    Utils.ajaxRequest(endpoint, {
      data: options,
      type,
      success: function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response);
        }
      },
    });

    return deferred;
  },

  loadContacts: function(options) {
    return this.makeRequest('/contacts', options, 'POST');
  },
};

Google.loaded = new $.Deferred();

window.onGoogleLoad = function() {
  Google.init(window.gapi);
};

try {
  adapter.google(() => {}, () => {
    Google.loaded.reject();
  });
} catch (e) {
  //
}

export default Google;
