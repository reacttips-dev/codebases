/* eslint-env node */

import User from 'core/src/models/user';
import EventTracker from 'core/src/utils/ss-event-tracker';
import AdminMenuHelper from 'core/src/helpers/admin-menu-helper';
import Alerts from 'core/src/views/modules/alerts';
import HeaderView from 'core/src/views/modules/header';
import HeaderMobileView from 'core/src/views/modules/header-mobile';
import SiteBannerView from 'core/src/views/modules/site-banner';
import Common from 'core/src/common';
import * as Sentry from '@sentry/browser';
import 'core/src/helpers/console-helper';
import 'jquery-cookie';
// navigator.seanBeacon polyfill, used for SS.EventTracker and other vendor modules
import 'navigator.sendbeacon';

const App = {

  initialize: function() {
    this.initializeSentry();

    // Setup global objects
    this.setupCurrentUser();
    this.setupVideoBootstrap();
    this.setupMixpanelEventTracker();

    // Initialize any components that are required on all pages
    this.initializeComponents();
    this.initializeHistory();
    this.checkTouchSupport();
    this.overrideBackboneSync(Backbone.sync);

    // temporary: this bit of code needs to run before DOMContentLoaded.
    // Page Specific JS is loaded asynchronously, so unfortunately, this needs to be in site bootstrap
    // @todo: remove the need to have any of this fixed header code by talking to design and getting rid
    // of this code and replace with a position:sticky CSS-only solution.
    if (SS.serverBootstrap.isClassDetails) {
      this.classDetailsFixedHeadersBootstrap();
    }

    // Get page dependencies from js array, include any page-specific js if we need to
    // Load dependencies
    const dependenciesAreLoaded = SS.pageDependencies.reduce(function(promise, dep) {
      return promise.then(() => {
        const imported = import(/* webpackChunkName: "pages-[request]" */ 'pages/' + dep);
        return imported.then((pageDependency) => {
          const Page = pageDependency.default;
          new Page();
        });
      });
    }, Promise.resolve());

    dependenciesAreLoaded.then(() => Common.runPageRoutine());

    if (SS?.serverBootstrap?.controllerAction) {
      console.log('[controller/action]:', SS.serverBootstrap.controllerAction); // eslint-disable-line no-console
    }
  },

  initializeComponents: function() {
    new HeaderView({
      el: $('.site-header'),
      containerEl: SS.serverBootstrap.isClassDetails ? $('#video-region') : null,
    });
    new HeaderMobileView({ el: $('.site-header-mobile') });
    new SiteBannerView();
    AdminMenuHelper.initialize();
    this.initializeSiteModules();
  },

  setupMixpanelEventTracker: function() {
    SS.EventTracker = EventTracker;
  },

  setupCurrentUser: function() {
    SS.currentUser = new User(SS.serverBootstrap.userData);

    // Configure the user in the Sentry integration
    Sentry.configureScope(function(scope) {
      scope.setUser({
        id: SS.currentUser.id,
      });
    });
  },

  classDetailsFixedHeadersBootstrap: function() {
    if (!SS.serverBootstrap.pageData) {
      return;
    }

    if (!SS.serverBootstrap.pageData.showFixedHeadersOnLoad) {
      return;
    }

    // We're in < IE10 which doesn't support classList
    if (!document.body.classList) {
      document.body.style.visibility = 'visible';
      return;
    }

    document.addEventListener('DOMContentLoaded', function() {
      if (SS.serverBootstrap.pageData.isMobile) {
        let mobileHeader = document.getElementsByClassName('site-header-mobile')[0];
        let classDetailsHeader = document.getElementsByClassName('class-details-header')[0];
        let fullHeaderHeight = mobileHeader.offsetHeight + classDetailsHeader.offsetHeight;

        // We want to show 15px of the class details header
        let scrollTop = fullHeaderHeight - 15;

        // Scroll the page down
        document.documentElement.scrollTop = scrollTop;
        document.body.scrollTop = scrollTop;

        document.body.style.visibility = 'visible';

        return;
      }

      // Class Navigation
      // Fetch DOM elements
      let mainRegion = document.getElementById('main-region');
      let navigationHeaderWrapper = document.getElementsByClassName('underline-tabs-wrapper')[0];
      let navigationHeaderWrapperPlaceholder = document.getElementsByClassName('underline-tabs-wrapper-placeholder')[0];
      let siteFooter = document.getElementsByClassName('site-footer')[0];

      // Save heights of the navigation header and site footer
      let navigationHeaderHeight = navigationHeaderWrapper.offsetHeight;
      let siteFooterHeight = siteFooter.offsetHeight;

      // Set the height of the navigation header onto it's placeholder
      // (the placeholders are used to keep the page height exactly the same even when
      // the main elements get changed to position: fixed and therefore come out of the
      // normal document flow)
      navigationHeaderWrapperPlaceholder.style.height = navigationHeaderHeight + 'px';

      // Calculate where the page should be scrolled to, make sure to calculate this
      // AFTER settings heights on the placeholders.
      let scrollTop = mainRegion.offsetTop - 1;
      let headersShown = false;

      let hideHeaders = function() {
        navigationHeaderWrapper.classList.remove('fixed-header');
        navigationHeaderWrapperPlaceholder.classList.add('hidden');
        navigationHeaderWrapper.style.top = 0 + 'px';
        headersShown = false;
      };

      let showHeaders = function() {
        navigationHeaderWrapper.classList.add('fixed-header');
        navigationHeaderWrapperPlaceholder.classList.remove('hidden');
        headersShown = true;
      };

      // Adjust the minimum height of the main region so we're always guaranteed
      // to see the fixed headers
      mainRegion.style.minHeight = window.innerHeight - siteFooterHeight + 'px';

      let toggleHeaders = function() {
        let documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (documentScrollTop < scrollTop) {
          hideHeaders();
        } else if (!headersShown) {
          showHeaders();
        }
      };

      // Storing this so that we're able to remove the event listener
      // once we're able to handle all of this in our app code
      SS.classDetailsHeaderFunction = toggleHeaders;
      window.addEventListener('scroll', toggleHeaders);

      // Finally display the page
      document.body.style.visibility = 'visible';
    });
  },

  setupVideoBootstrap: function() {
    SS.VIDEO = {};
    _.each(SS.serverBootstrap.VIDEO, function(videoBootstrapValue, videoBootstrapName) {
      SS.VIDEO[videoBootstrapName] = videoBootstrapValue;
    });
  },

  // Provide some extra when making requests and handling responses
  overrideBackboneSync: function(originalSync) {
    Backbone.sync = function(method, model, options = {}) {

      const { beforeSend, success, error } = options;

      // always add the CSRF token to request headers
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', $.cookie('YII_CSRF_TOKEN'));

        return (!_.isUndefined(beforeSend)) ? beforeSend.apply(this, arguments) : null;
      };
      // Check for redirectTos in 200 responses
      options.success = function(response) {
        if (!_.isUndefined(response.redirectTo)) {
          window.location = response.redirectTo;
        }

        return success.apply(this, arguments);
      };

      // Handle 302 responses by redirecting the browser
      options.error = function(xhr, response) {
        if (response.status === 302) {
          try {
            const data = JSON.parse(response.responseText);
            if (!_.isUndefined(data.redirectTo)) {
              window.onbeforeunload = null;
              window.location = data.redirectTo;
            }
          } catch (e) {
            // nothing
          }
        }

        return (_.isFunction(error)) ? error.apply(this, arguments) : null;
      };
      return originalSync.apply(Backbone, arguments);
    };
  },

  checkTouchSupport: function() {
    if (!('ontouchstart' in document.documentElement)) {
      $('body').addClass('no-touch');
    }
  },

  initializeHistory: function() {
    window.onpopstate = function(event) {
      Backbone.trigger('popstate', event);
    };
  },

  initializeSiteModules: function() {
    // Site modules are objects we can trigger from anywhere in the codebase.
    // They're a little like a singleton
    // These should be used with care
    const siteModules = {
      alerts: new Alerts(),
    };
      // Add a handler for any event we trigger globally
      // This can include triggering an event that we want to pass to one of our site modules above
    SS.events.on('all', function(eventName, data) {
      // Split events
      const eventParts = eventName.split(':');
      const moduleType = eventParts[0];
      const moduleEvent = eventParts[1];
      // See if we have a site module associated with this event type
      const module = _.find(siteModules, function(moduleObject, moduleName) {
        return moduleName === moduleType;
      });
        // If we do have a module for this event, pass the event itself on to the object
      if (module) {
        module.trigger(moduleEvent, data);
      }
    });

    // See if we need to trigger a site alert on page load
    // Can be the case when we use a page reload on an action (legacy)
    const siteAlertTrigger = $('#site-alert-trigger');
    if (siteAlertTrigger.length > 0) {
      SS.events.trigger('alerts:create', {
        type: siteAlertTrigger.data('ss-type') || 'success',
        title: siteAlertTrigger.val(),
        action: siteAlertTrigger.data('ss-action'),
        actionString: siteAlertTrigger.data('ss-action-string'),
        time: siteAlertTrigger.data('ss-duration'),
      });
    }
  },

  initializeSentry: function() {
    // These variables have been injected in to the front-end HTML by the backend renderer!
    const sentryDsn = $('meta[name=sentry_dsn]').attr('content');
    const environment = $('meta[name=environment]').attr('content');
    const release = process.env.RELEASE;

    Sentry.init({
      dsn: sentryDsn,
      environment: environment,
      release: release,
      denyUrls: [
        // Firefox extensions
        /moz-extension:\/\//i,
        // Chrome extensions
        /chrome-extension:\/\//i,
        // Safari extensions
        /.safariextension/i,
        // Podsights errors related to localStorage
        /cdn.pdst.fm/i,
        // twitter ads from GTM
        /static.ads-twitter.com/i,
        // google APIS for sign in / sign up
        /apis.google.com/i,
        // google one tap library
        /gis_client_library/i,
        // google tag manager
        /www.googletagmanager.com/i,
        // Twitter analytics
        /analytics.twitter.com/i,
        // Tracking code coming from GTM
        /analytics-sm.com/i,
        // bing tracker
        /bing.com/i,
        // Tiktok Analytics
        /analytics.tiktok.com/i,
        // Twitter Widget
        /platform.twitter.com/i,

      ],
      ignoreErrors: [
        // The failed to fetch error is actually a TypeError, usually triggered by some click event
        // followed by a network request that lives outside our application that fails.
        'Failed to fetch',
        // Same error as above, but specific to Firefox's implementation
        'NetworkError when attempting to fetch resource',
        // Safari's implementation of canceled requests are language specific, so we block all Network Errors
        // otherwise we'd need to manintain a list of "canceled" error messages in every language
        // unless it's Unexpected JSON, which indicates a real error from our servers, thrown by Apollo Client
        // see https://regex101.com/r/NgjiY9/1
        // see here for more info: https://stackoverflow.com/questions/55738408/javascript-typeerror-cancelled-error-when-calling-fetch-on-ios
        /Network Error: (?!Unexpected|JSON).+/i,
        // The AbortError is thrown when a user aborts playing the video, either by pausing or navigating
        // away from the video before the play() promise is returned.
        'AbortError',
        // The NotAllowedError is related to autoplay. We're trying to play the video programmatically
        // before the user interacts with the document, or they have some setting preventing autoplay.
        'NotAllowedError',
        // An error present in the Crazy Egg script, loaded by GTM
        'CE: multiple userscripts installed',
        // The NotSupportedError occurs as a result of MEDIA_ERR_SRC_NOT_SUPPORTED errors thrown from
        // the media element. This means that "The associated resource or media provider object (such
        // as a MediaStream) has been found to be unsuitable." Most likely, this is a result of a drop
        // in network connection or other network anomaly.
        'NotSupportedError',
        // This exception is thrown when the "Block third-party cookies and site data"
        // checkbox is set in Content Settings in Chrome browsers.
        'SecurityError: Failed to read the \'sessionStorage\' property from \'Window\': Access is denied for this document.',
        // This exception is thrown by a WmiPrvSE.exe malware injection to a page
        // /CE2\.\w+/,  //Not sure if this RegEx works?
        /CE2.dbg/,
        /CE2.debug/,
        /CE2.userMain/,
        // We are not sure what causes this error, but it is filling up the Sentry logs in an odd and
        // confusing way. For full context, see the comments on the JIRA ticket:
        // https://skillsharenyc.atlassian.net/browse/SK-25217
        'TypeError: this.el_.vjs_getProperty is not a function',
        // SourceBuffer errors originate from videojs and occurs when a user changes the video.
        // Mike has a comment out asking if videojs PR #442 is a fix for this issue: https://github.com/videojs/http-streaming/issues/227#issuecomment-482108352
        // Adding to the ignore list for now until we see this change come through the BC player.
        'SourceBuffer',
        // Failed chunks are when webpack fails to dynamically load a script. This can happen on any flaky
        // connection or on any slow connection if the connection takes too long to connect. In general, there's
        // nothing to do here except ignore the error.
        /Loading chunk \d+ failed/,
      ],
      beforeSend (error, hint) {
        // If a promise is rejected because it's not trusted, don't send along to Sentry as it is likely a bot
        if (error.extra && error.extra.__serialized__ && error.extra.__serialized__.isTrusted === false) {
          return null;
        }

        // We use the following approach when an error's message not descriptive enough,
        // but we still want to prevent the errors from making it to Sentry.
        const exceptionStrings = [
          // The following two errors are from older versions of Edge, and/or related to
          // a user's third-party cookies settings.
          'sessionStorage is not available in the current environment',
          'localStorage is not available in the current environment',
          'Cookies are not enabled in current environment',

        ];
        const details = hint && hint.originalException && hint.originalException.details;
        if (!details) {
          return error;
        }

        const stringFound = exceptionStrings.find(str => details.includes(str));

        if (stringFound) {
          return null;
        }

        return error;
      },
    });
  },

};

export default App;
