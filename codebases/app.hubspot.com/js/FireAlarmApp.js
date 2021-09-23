'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import AlarmApi from './api/AlarmApi';
import EventGroups from './constants/EventGroups';
import Severity from './constants/Severity';
import Alarm from './model/Alarm';
import AlarmContainer from './model/AlarmContainer';
import EventData from './model/EventData';
import debug from './util/Debug';
import Dom from './util/Dom';
import { isQa } from './util/Env';
import Events from './util/Events';
import { triggerEvent } from './util/CustomEvent';
import { defaults, objectAssign } from './util/Objects';
import Storage from './util/Storage';
import StyleSheet from './view/StyleSheet';
import alarmsDisabled from './util/Selenium';
var DEFAULT_CUSTOM_CONTAINER_CLASS = 'fire-alarm-custom-container';
var HUBSPOT_FIREALARM_KEY = 'fireAlarm';
var INCLUDE_BENDER_DOC_LINK = 'https://git.hubteam.com/HubSpot/FireAlarmUi/blob/master/README.md#including-benderprojectdepandpathvariables';
var NAV_V4_ID = 'hs-nav-v4';
var SHOW_DEBUG_ALARMS_KEY = 'firealarm.show.debug.alarms';

var FireAlarmApp = /*#__PURE__*/function () {
  /*
   * @param Object hubspot        window.hubspot object
   * @param Object originalConfig (optional) Config object with the following keys:
   *   {
   *     appName:    String (optional) if this is empty appName is taken from bender.
   *     containers: {
   *       default: {
   *         after:              HTMLElement (optional) element in the parent to insert before
   *         additionalClasses:  CSS classes to add to the container
   *         parent:             HTMLElement The element to add the alarm container to,
   *         before:             HTMLElement (optional) element in the parent to insert before
   *       },
   *       critsit: (optional) An over-ride for Crisit Alarms. Same footprint as the default
   *                container
   *     }
   *   }
   */
  function FireAlarmApp(hubspot) {
    var originalConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, FireAlarmApp);

    this.className = 'FireAlarmApp';
    this.hubspot = hubspot;
    this.events = new Events();
    this.events.extractPreloadEvents(hubspot[HUBSPOT_FIREALARM_KEY] || {});
    this.alarms = [];

    try {
      var localStorage = window && window.localStorage ? window.localStorage : false;
      this.storage = new Storage(localStorage);
    } catch (e) {
      this.storage = new Storage(false);
    }

    this.events.runEvents(EventGroups.ON_LOAD);
    this.config = defaults(originalConfig, {
      containers: {}
    });
    hubspot[HUBSPOT_FIREALARM_KEY] = this;
  }
  /**
   * @param Object config   App Config, same as gets passed to the constructor
   * @return AlarmContainer Returns a container built from config.containers.critsit where the config is set,
   *                        otherwise it falls back to using the supplied container, if that container was
   *                        built from custom config (config.containers.default). Finally, if no container config
   *                        was passed, it creates a new critsit container.
   */


  _createClass(FireAlarmApp, [{
    key: "selectOrMakeCritsitContainer",
    value: function selectOrMakeCritsitContainer(config, container) {
      if (config.containers.critsit) {
        var critsitConfig = config.containers.critsit;
        critsitConfig.additionalClasses = critsitConfig.additionalClasses || [];
        critsitConfig.additionalClasses.push('firealarm-critsits');
        return this.makeContainer(critsitConfig);
      } else if (config.containers.default) {
        return container;
      } else {
        return this.makeNavContainer(true);
      }
    }
  }, {
    key: "addCss",
    value: function addCss() {
      var headElement = document.getElementsByTagName("head")[0];

      if (headElement) {
        var styleEl = StyleSheet.getCss();
        headElement.appendChild(styleEl);
      }
    }
    /**
     * @VisibleForTesting
     */

  }, {
    key: "getAlarmApi",
    value: function getAlarmApi() {
      return new AlarmApi(this.getDom(), this.storage, this.events);
    }
    /**
     * @VisibleForTesting
     */

  }, {
    key: "getDom",
    value: function getDom() {
      if (!this.dom) {
        this.dom = new Dom(document);
      }

      return this.dom;
    }
  }, {
    key: "getNav",
    value: function getNav() {
      if (!this.navElement) {
        var navElement = this.getDom().getElementById(NAV_V4_ID); // If we can't find an element with the nav id just chuck the alarms at the top of the page.

        if (!navElement) {
          navElement = this.getDom().getBody().firstChild; // Find the first non-text node

          while (navElement != null && navElement.nodeType == 3) {
            navElement = navElement.nextSibling;
          }
        }

        if (!navElement) {
          throw "No Nav element could be found to add FireAlarms";
        }

        this.navElement = navElement;
      }

      return this.navElement;
    }
    /**
     * Get Alarms for this app
     */

  }, {
    key: "loadAndRenderAppAlarms",
    value: function loadAndRenderAppAlarms(appName) {
      var _this = this;

      var addCss = this.addCss,
          hubspot = this.hubspot;
      this.getAlarmApi().getAlarms(appName, function (newAlarms, apiError) {
        if (apiError) {
          debug('ApiError', apiError.getMessage(), apiError);
        } else {
          debug('Loaded alarms from FireAlarmApi', newAlarms);

          _this.events.runEvents(EventGroups.ON_RECEIVE_ALARM, new EventData(newAlarms)); // Is this QA? Do we have hubspot.bender.currentProject? If not show a FireAlarm warning the dev.


          if (isQa() && (!hubspot.bender || !hubspot.bender.currentProject)) {
            newAlarms.push(_this.getBenderWarningAlarm());
          }

          if (newAlarms.length > 0) {
            if (_this.alarms == 0) {
              //Check to make sure the CSS isn't added a second time due to an addAlarm call
              addCss();
            }

            _this.alarms = newAlarms;

            _this.renderAlarms();
          }
        }
      });
    }
  }, {
    key: "renderAlarms",
    value: function renderAlarms() {
      var _this2 = this;

      var alarms = this.prioritiseAlarms(this.filterAlarms(this.alarms));
      this.containers.default.removeAllAlarms();
      this.containers.critsit.removeAllAlarms();
      alarms.forEach(function (alarm) {
        if (alarm.severity === Severity.CRITSIT) {
          _this2.containers.critsit.addAlarm(alarm);
        } else {
          _this2.containers.default.addAlarm(alarm);
        }
      });
      this.renderContainers();
      alarms.forEach(function (alarm) {
        _this2.events.runEvents(EventGroups.ON_RENDER_ALARM, alarm);
      });
      this.events.runEvents(EventGroups.ON_RENDER_ALL, new EventData(alarms));
    }
  }, {
    key: "getAppName",
    value: function getAppName() {
      if (!this.hubspot || !this.hubspot.bender || !this.hubspot.bender.currentProject) {
        return null;
      }

      return this.hubspot.bender.currentProject;
    }
  }, {
    key: "makeContainer",
    value: function makeContainer(config) {
      var additionalClasses = (config.additionalClasses || []).concat([DEFAULT_CUSTOM_CONTAINER_CLASS]);
      var mergedConfig = objectAssign({
        additionalClasses: additionalClasses
      }, config);
      return new AlarmContainer(mergedConfig);
    }
  }, {
    key: "makeNavContainer",
    value: function makeNavContainer() {
      var critsit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var dom = this.getDom();
      var body = dom.getBody();
      var nav = this.getNav();
      var config;

      if (critsit) {
        config = {
          parent: body,
          before: nav,
          additionalClasses: ['firealarm-critsits']
        };
      } else {
        config = {
          parent: body,
          after: nav
        };
      }

      return new AlarmContainer(config);
    }
    /**
     * Get the QA warning message asking devs to install benderProjectDepAndPathVariables
     */

  }, {
    key: "getBenderWarningAlarm",
    value: function getBenderWarningAlarm() {
      return new Alarm({
        title: 'FireAlarm needs some setup!',
        message: "Please include 'benderProjectDepAndPathVariables' in this app to report it to FireAlarm. See the <a href=\"" + INCLUDE_BENDER_DOC_LINK + "\">FireAlarm docs</a> for more information.",
        createdAt: Date.now(),
        severity: Severity.MAINTENANCE.key
      }, this.getDom(), this.storage);
    }
  }, {
    key: "filterAlarms",
    value: function filterAlarms(alarms) {
      if (this.storage.getItem(SHOW_DEBUG_ALARMS_KEY) === 'true') {
        return alarms;
      }

      return alarms.filter(function (alarm) {
        var regEx = new RegExp(alarm.urlRegexPattern);
        return !alarm.debug && alarm.urlRegexPattern ? regEx.test(window.location.href) : true;
      });
    }
    /**
     * Returns alarms sorted by priority, highest to lowest
     *
     * @return array
     */

  }, {
    key: "prioritiseAlarms",
    value: function prioritiseAlarms(alarms) {
      return alarms.sort(function (a, b) {
        if (a.severity === b.severity) {
          return 0;
        }

        return a.severity.priority < b.severity.priority ? 1 : -1;
      });
    } // This is used by FireAlarmClient to create frontend alarms

  }, {
    key: "addAlarm",
    value: function addAlarm(alarmData) {
      var alarm = new Alarm(alarmData, this.getDom(), this.storage, this.events, alarmData.date);

      if (this.alarms.length == 0) {
        this.addCss();
      }

      this.alarms.push(alarm);

      if (alarm.severity === Severity.CRITSIT) {
        this.containers.critsit.addAlarm(alarm);
      } else {
        this.containers.default.addAlarm(alarm);
      }

      this.renderContainers();
      this.events.runEvents(EventGroups.ON_RENDER_ALARM, alarm);
    }
  }, {
    key: "renderContainers",
    value: function renderContainers() {
      if (!alarmsDisabled(this.storage)) {
        if (this.containers.default.alarmElements.length > 0) {
          this.containers.default.render();
        }

        if (this.containers.default !== this.containers.critsit && this.containers.critsit.alarmElements.length > 0) {
          this.containers.critsit.render();
        }
      }
    }
  }, {
    key: "addLocationChangeEvent",
    value: function addLocationChangeEvent() {
      var _this3 = this;

      //
      // Warning: Modifying global history object
      //
      history.pushState = function (f) {
        return function pushState() {
          var ret = f.apply(this, arguments);
          triggerEvent('fireAlarmLocationChange');
          return ret;
        };
      }(history.pushState);

      history.replaceState = function (f) {
        return function replaceState() {
          var ret = f.apply(this, arguments);
          triggerEvent('fireAlarmLocationChange');
          return ret;
        };
      }(history.replaceState);

      window.addEventListener('popstate', function () {
        triggerEvent('fireAlarmLocationChange');
      });
      window.addEventListener('fireAlarmLocationChange', function () {
        debug('Refiltering fire alarms for this page');

        _this3.renderAlarms();
      });
    }
  }, {
    key: "start",
    value: function start() {
      debug('FireAlarm started');
      var appName = this.config.appName || this.getAppName();
      var containerConfig = this.config.containers.default || false;
      var container = containerConfig ? this.makeContainer(containerConfig) : this.makeNavContainer();
      var critsitContainer = this.selectOrMakeCritsitContainer(this.config, container);
      this.containers = {
        default: container,
        critsit: critsitContainer
      };
      this.loadAndRenderAppAlarms(appName);
      this.addLocationChangeEvent();
      this.events.runEvents(EventGroups.CREATE_ALARM, this);
    }
  }]);

  return FireAlarmApp;
}();

FireAlarmApp['HUBSPOT_FIREALARM_KEY'] = HUBSPOT_FIREALARM_KEY;
export default FireAlarmApp;