import adapter from 'core/src/base/remote-script-adapter';
import Utils from 'core/src/base/utils';

const fbScope = 'email';

// set up dummy object. Will be filled in when the FB-API returns
let Facebook = {};

// These methods will be filled into the Facebook object when the dependency loads.
// This should be treated as the API of this class.
const fbMethods = {
  init: function() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: $('#fb-id').val(),
        version: 'v5.0',
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse XFBML
      });
      //  Trigger event that FB did load - listened for in class.js
      Facebook.loaded.resolveWith(this);
    };

    return this;
  },

  fbLoginAsSignUp: function(asSignUp, redirectTo, via) {
    // We are now required to add the parameter 'rerequest' on sign up
    // incase the user decides to not give us their email and we need
    // to ask them for the permission again. We don't need to rerequest on
    // login because the user has already signed up and we already have their email.
    window.FB.login(function(response) {
      if (response.authResponse) {
        let loc = null;
        const queryParams = {};

        if (asSignUp) {
          loc = '/site/signupViaFacebook';
        } else {
          loc = '/site/loginViaFacebook';
        }

        if (redirectTo) {
          queryParams.redirectTo = redirectTo;
        }
        if (via) {
          queryParams.via = via;
        }

        loc = loc + '?' + $.param(queryParams);
        window.location = loc;
      }
    }, {
      scope: fbScope,
      auth_type: asSignUp ? 'rerequest' : undefined,
    });
  },

  linkFacebook: function(trackingSource) {
    let callbackFunction = function (fbResponse) {
      if (fbResponse.authResponse) {
        let url = '/site/facebookconnect';

        if (!_.isNull(trackingSource)) {
          url += '?trackingSource=' + trackingSource;
        }

        Utils.ajaxRequest(url, {
          type: 'post',
          data: {
            trackingSource,
            redirectTo: fbResponse.redirectTo,
          },
          success: function(response) {
            let redirectTo = typeof response.redirectTo !== 'undefined';
            window.location = redirectTo ? response.redirectTo : 'account';
          },
          error: function(response) {
            const responseText = $.parseJSON(response.responseText);
            SS.events.trigger('alerts:create', {
              title: responseText.errors.general,
              type: 'error',
            });
          }
        });
      } 
    };
    window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        callbackFunction(response);
      } else {
        window.FB.login(callbackFunction, { scope: fbScope });
      }
    });
  },

  shareObject: function(options = {}, success, failure) {
    const params = {
      method: options.method || 'feed',
      display: options.display || 'popup',
    };

    if (options.method === 'share') {
      // Facebook will parse the URL for the OG meta tags
      params.href = options.href || window.location.href;
    } else {
      // Manually construct the share object
      params.name = options.name || window.document.title;
      params.link = options.link || window.location.href;
      params.picture = options.picture;
      params.caption = options.caption;
      params.description = options.description;
    }

    window.FB.ui(params, function(response) {
      if (response && response.post_id && success) {
        success(response);
      } else if (failure) {
        failure(response);
      }
    });
  },

  // Note: If you are sharing a URL with query parameters on QA,
  // the shared URL will not count towards the share count of the canonical
  // URL because we have password authentication on QA. This causes
  // Facebook to be unable to scrape the page and see what the canonical
  // URL is and therefore can't increment the share count for that URL.
  getShareCount: function(url, callback) {
    Utils.ajaxRequest('/facebook/shareCount', {
      data: {
        url: url,
      },
      success: function(response) {
        callback(response.shareCount || 0);
      },
      error: function() {
        callback(0);
      },
    });
  },
};

// allow implementing classes to hook into the success/failure of the request
// via .done and .fail
Facebook.loaded = new $.Deferred();

// stub out the functions and proxy them to a deferred callback that
// will complete when fb dep loads
_.each(_.functions(fbMethods), function(method) {
  Facebook[method] = function() {
    const args = arguments;

    // wait on FB load to actually fire the method
    Facebook.loaded.done(function() {
      Facebook[method].apply(Facebook, args);
    });
  };
});

// mixin Backbone.events for event handling
_.extend(Facebook, Backbone.Events);

// asynchronously fetch the FB API, popuplate the Facebook object when dep fulfilled.
adapter.facebook(function() {

  // overwrite the dummy methods once the API is usable
  Facebook = _.extend(Facebook, fbMethods);

  Facebook.init();

  // handle error case
}, function() {
  Facebook.loaded.rejectWith(Facebook);
});

export default Facebook;
