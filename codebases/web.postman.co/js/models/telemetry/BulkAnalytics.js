import HttpService from '../../utils/HttpService';
import CurrentUserController from '../../modules/controllers/CurrentUserController';
import { isServedFromPublicWorkspaceDomain } from '../../../appsdk/utils/commonWorkspaceUtils';
import Backbone from 'backbone';

const validAnalyticsProperties = [
  'category',
  'action',
  'label',
  'value',
  'meta',
  'workspaceId',
  'workspaceType',
  'entityId',
  'entityType',
  'traceId',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term'
];

const ANALYTICS_BATCH_TIME = window.SDK_PLATFORM === 'browser' ? 30000 : 60000;

var BulkAnalytics = Backbone.Model.extend({
  initialize: function () {

    this.modelsToLoad = ['history', 'collection', 'environment'];
    this.modelsLoaded = false;
    this.payloads = [];
    this.enabled = true;
    this.loadEventsSent = false;
    this.isLoggingEnabled = false;

    // Flush pending events before the page is unloaded
    if (window.SDK_PLATFORM === 'browser') {
      window.addEventListener('beforeunload', () => {
        try {
          this.sendPayloads({ isFlushBeforePageClose: true });
        } catch (e) {
          pm.logger.error('Flushing analytics event before page unload fails', e);
        }
      }, { capture: true });
    }

    if (window.DISABLE_ANALYTICS) {
      this.enabled = false;
    }

    if (window.ENABLE_ANALYTICS_LOG) {
      this.isLoggingEnabled = true;
    }

    let modelEventBus = pm.eventBus.channel('model-events'),
        appEventsBus = pm.eventBus.channel('app-events');

    modelEventBus.subscribe((event = {}) => {
      if (event.namespace === 'user') {
        if (_.includes(['login', 'signup', 'refreshUserData', 'logout'], event.name)) {
          CurrentUserController
            .get()
            .then((user) => {
              this.setBaseObject(user);
            })
            .catch((e) => {
              console.log('Error in fetching user information', e);
            });
        }
        else if (event.name === 'logout') {
          this.clearUserContext();
        }
      }
    });

    appEventsBus.subscribe((event = {}) => {
      if (event.name === 'booted') {
        let process = event.namespace;

        if (process === pm.windowConfig.process) {
          CurrentUserController
            .get()
            .then((user) => {

              // Set user context on app load also.
              this.setBaseObject(user);

              // Load events can be sent for the shared process alone.
              if (process === 'shared') {
                this.sendAppLoadEvents();
              }
            })
            .catch((e) => {
              console.log('Error in fetching user information', e);
            });
        }
      }
    });

    setInterval(function () {
      this.sendPayloads();
    }.bind(this), ANALYTICS_BATCH_TIME);
  },

  sendAppLoadEvents: function () {
    if (this.loadEventsSent) {
      this.loadEventsSent = true;
      return;
    }

    const app = require('electron').remote.app,
          osReleaseVersion = require('os').release(),
          firstLoad = app.firstLoad,
          parser = require('ua-parser-js'),
          userAgent = parser(navigator.userAgent),
          browser = _.get(userAgent, 'browser', {}),
          loadEvent = window.SDK_PLATFORM === 'browser' ? {
            category: 'app',
            action: 'load',
            label: browser.name ? `${browser.name} ${browser.version}` : 'browser'
          } : {
            category: 'app',
            action: 'load',
            label: firstLoad ? 'first_time' : undefined,
            meta: {
              // For mac this will send the unix version
              // For the mapping of this version to actual OSX version see https://en.wikipedia.org/wiki/Darwin_(operating_system)#Release_history
              os_version: osReleaseVersion
            }
          };

    // Send the analytics event immediately
    // Note: this is the only event that does not honour the
    // user setting which decides whether or not to send any analytics events
    if (window.SDK_PLATFORM === 'desktop' && firstLoad) {
      this._sendEventImmediately(loadEvent);
    }

    // Queue the event, this will be batched and sent later (if the analytics is turned-on by the user)
    else {
      this.addCurrentEvent(loadEvent);
    }

    this.addCurrentEvent({
      category: 'app',
      action: 'load_distribution_channel',
      label: pm.env.SNAP ? 'snap' : 'postman_website'
    });

    this.loadEventsSent = true;
  },

  setBaseObject: function (user = {}) {
    const appVersion = pm.app.get('version'),
          appId = pm.app.get('installationId'),
          parser = require('ua-parser-js'),
          userAgent = parser(navigator.userAgent),
          browser = _.get(userAgent, 'browser', {});

    let teamId = '',
        teams = user.organizations;

    if (teams && teams.length > 0) {
      var team = teams[0];
      teamId = team.id;
    }

    // final type check for userId
    var userId = user.id;
    if (typeof userId === 'undefined') {
      userId = '0';
    }

    const baseObject = {
      'type': 'events-general',
      'indexType': 'client-events',
      'env': postman_env,
      'propertyId': appId,
      'userId': (String(userId)),
      'teamId': (String(teamId))
    };

    if (window.SDK_PLATFORM === 'browser') {
      this.baseObject = _.omit(baseObject, 'propertyId');
      this.baseObject.propertyVersion = browser.name ?
        `${appVersion};${browser.name};${browser.version}` : `${appVersion};unknown;unknown`;
      this.baseObject.property = isServedFromPublicWorkspaceDomain() ? 'postman-web-public' : 'postman-web';

      // This is an interim solution for teamId not getting initialized in the analytics object. We are using
      // the teamId injected by the server to fix this. This can be avoided if we make team information fetching faster
      // and move earlier in the application lifecycle
      this.baseObject.teamId = window.TEAM_ID;
    } else {
      var platform = require('os').platform(),
        property = platform === 'darwin' ? 'mac_app' :
                   platform === 'linux' ? 'linux_app' : 'windows_app';

        this.baseObject = baseObject;
        this.baseObject.propertyVersion = appVersion;
        this.baseObject.property = property;
    }
  },

  _extendEventWithBaseObject: function (event) {
    if (!this.baseObject) {
      this.setBaseObject();
    }

    let timestamp = (new Date()).toISOString(),
        payload = _.extend(_.clone(this.baseObject), {
          timestamp: timestamp,
          ..._.pickBy(event, (value, key) => {
            return _.includes(validAnalyticsProperties, key) && value;
          })
        });

    return payload;
  },

  addCurrentEvent: function (event) {
    let analyticsEnabled = pm.settings.getSetting('googleAnalytics');

    if (!analyticsEnabled) { return; }

    let payload = this._extendEventWithBaseObject(event);

    this.queuePayload(payload);
  },

  addCurrentSyncDiscarded: function (verb, entity, data, error) {
    try {
      if (pm.isTesting || verb === 'history') {
        return;
      }
      var analyticsEnabled = pm.settings.getSetting('googleAnalytics');
      if (!analyticsEnabled) { return; }

      if (!this.baseObject) {
        this.setBaseObject();
      }

      var timestamp = (new Date()).toISOString();
      var newObject = _.extend(_.clone(this.baseObject), {
        verb: verb,
        entity: entity,
        data: JSON.stringify(data),
        type: 'sync',
        indexType: 'client-errors'
      });

      if (error) {
        newObject.error = JSON.stringify(error);
      }

      this.queuePayload(newObject);
    }
    catch (e) {
      console.log('Could not send sync error to LS');
    }
  },

  queuePayload: function (payload) {
    this.payloads.push(payload);
  },

  sendPayloads: function (options) {
    let analyticsEnabled = pm.settings.getSetting('googleAnalytics');

    if (!analyticsEnabled || !this.enabled) {
      this.clearPayloads();
      return;
    }

    if (this.payloads.length > 0) {
      let reqBodyText = '';

      _.each(this.payloads, function (ca) {
        reqBodyText += JSON.stringify(ca) + '\n';
      });

      let sendRequestOption;
      if (options && options.isFlushBeforePageClose) {
        sendRequestOption = { useBeacon: options.isFlushBeforePageClose };
      }

      this.sendRequest(reqBodyText, sendRequestOption);
      this.clearPayloads();
    }
  },

  sendRequest: function (reqBodyText, options) {
    const url = window.postman_analytics_url;
    let encodedReqBody;

    try {
      encodedReqBody = btoa(reqBodyText);
    }
    catch (e) {
      pm.logger.error('Could not run btoa on reqBodyText: ' + reqBodyText);

      // don't want the xhr call to go through
      return;
    }

    // Logging will be enabled for `beta` and `stage` env ONLY
    if (this.isLoggingEnabled) {
      console.log('Analytics event payload', reqBodyText);
    }

    // Flag to keep track if a request is sent with beacon
    let requestSentWithBeacon;

    if (options && options.useBeacon && navigator.sendBeacon) {
      // The return value of sendBeacon is a boolean
      // True - if browser successfully able to queue the request
      // False - if browser fails to queue the request. Can happen if the size limit is exceeded or due to some browser failure
      requestSentWithBeacon = navigator.sendBeacon(url, encodedReqBody);
    }

    // Use HttpService, if either -
    // 1. useBeacon is not mentioned as true
    // 2. useBeacon is true but the beacon API is not available
    // 3. useBeacon is true and beacon API is also available, but the request could not be added to browser queue
    // either due to size limit or any browser error
    if (!requestSentWithBeacon) {
      HttpService.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: encodedReqBody,
        credentials: 'omit'
      });
    }

  },

  clearPayloads: function () {
    this.payloads = [];
  },

  // This function bypasses the:
  // 1. batching and queueing events
  // 2. any check for whether analytics is enabled or not
  // Do not use this function for any purpose other than for those
  // events which MUST bypass all the above checks
  // see https://postmanlabs.atlassian.net/browse/APPSDK-747 for more details
  _sendEventImmediately: function (event) {
    let extendedEvent = this._extendEventWithBaseObject(event),
        reqBodyText = JSON.stringify(extendedEvent);

    this.sendRequest(reqBodyText);
  }
});

export default BulkAnalytics;
