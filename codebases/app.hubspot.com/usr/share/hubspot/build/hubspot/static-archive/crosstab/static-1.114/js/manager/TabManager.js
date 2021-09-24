'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { debug } from '../util/DebugUtil';
import { generateId } from '../util/ObjectUtil';
import EventManager from './EventManager';
import StorageManager from './StorageManager';
import { HEARTBEAT_INTERVAL, CHECK_MASTER_INTERVAL, CHECK_MASTER_THRESHOLD, STORAGE_HEARTBEAT, STORAGE_MESSAGE, STORAGE_TAB_LIST, EVENT_BECOME_MASTER, EVENT_SURRENDER_MASTER, EVENT_ANY_MESSAGE, EVENT_MESSAGE, EVENT_REMOVED } from '../constants';

var TabManager = /*#__PURE__*/function () {
  function TabManager(namespace, options) {
    var _this = this;

    var storage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new StorageManager();
    var currentWindow = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

    _classCallCheck(this, TabManager);

    // Bind methods
    this.checkMasterIsAlive = this.checkMasterIsAlive.bind(this);
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
    this.handleUpdatedTabs = this.handleUpdatedTabs.bind(this);
    this.heartbeat = this.heartbeat.bind(this);
    this.unregister = this.unregister.bind(this); // Initialize attributes

    this.currentTab = generateId('tab');
    this.storage = storage;
    this.options = options; // Set namespace

    storage.setNamespace(namespace);
    storage.setKey.apply(storage, _toConsumableArray(options.storageKey || [])); // Callbacks

    this.eventManger = new EventManager();
    Object.keys(options) // Take only options starting with `on`
    .filter(function (option) {
      return /^on[A-Z]/.test(option);
    }).forEach(function (callback) {
      if (_this[callback] && options[callback]) {
        _this[callback](options[callback]);
      }
    });
    this.storage.onItemChange(STORAGE_MESSAGE, this.handleReceivedMessage);

    if (!this.options.passive) {
      this.storage.onItemChange(STORAGE_TAB_LIST, this.handleUpdatedTabs); // currentWindow can be mocked with an EventManager for testing

      currentWindow.addEventListener('beforeunload', this.unregister); // Register tab

      this.register(); // Periodically check that master tab is alive

      this.checkMasterAliveInterval = setInterval(this.checkMasterIsAlive, CHECK_MASTER_INTERVAL);
    }
  } // Check that the master tab is still alive. Update master if not


  _createClass(TabManager, [{
    key: "checkMasterIsAlive",
    value: function checkMasterIsAlive() {
      var masterTab = this.getMasterTab();
      var now = Date.now();
      var lastHeartbeat = this.storage.getItem(STORAGE_HEARTBEAT);

      if (now - lastHeartbeat > CHECK_MASTER_THRESHOLD) {
        // Remove master tab
        debug("Master (" + masterTab + ") removed due to inactivity");
        this.storage.removeArrayItem(STORAGE_TAB_LIST, masterTab);
      }
    }
  }, {
    key: "didBecomeMasterTab",
    value: function didBecomeMasterTab() {
      debug('Tab is now master');
      this.eventManger.trigger(EVENT_BECOME_MASTER);
      this.heartbeat();
      this.heartbeatInterval = setInterval(this.heartbeat, HEARTBEAT_INTERVAL);
    }
  }, {
    key: "register",
    value: function register() {
      if (!this.options.passive) {
        debug('Registered current tab with id:', this.currentTab);
        this.storage.pushItem(STORAGE_TAB_LIST, this.currentTab);
      } else {
        debug("Tab is passive. Won't be registered");
      }
    }
  }, {
    key: "reRegister",
    value: function reRegister() {
      debug('Current tab was removed from localStorage. Re-registering');
      clearInterval(this.heartbeatInterval);
      this.eventManger.trigger(EVENT_REMOVED);
      this.register();
    } // Send message

  }, {
    key: "dispatchMessage",
    value: function dispatchMessage(message) {
      debug('Dispatching message:', message);
      this.storage.setItem(STORAGE_MESSAGE, {
        from: this.currentTab,
        id: generateId('message'),
        message: message
      });
    } // Return master tab (1st tab in list)

  }, {
    key: "getMasterTab",
    value: function getMasterTab() {
      return this.storage.getArrayItem(STORAGE_TAB_LIST)[0];
    }
  }, {
    key: "isCurrentTabMaster",
    value: function isCurrentTabMaster() {
      return this.getMasterTab() === this.currentTab;
    }
  }, {
    key: "isCurrentTabInTabList",
    value: function isCurrentTabInTabList() {
      return this.storage.getArrayItem(STORAGE_TAB_LIST).indexOf(this.currentTab) > -1;
    }
  }, {
    key: "handleReceivedMessage",
    value: function handleReceivedMessage(value) {
      if (!value) {
        debug("Received undefined or null message. currentTab: " + this.currentTab);
        return;
      }

      if (value.from === this.currentTab) {
        return;
      }

      debug('Received message:', value);
      this.eventManger.trigger(EVENT_ANY_MESSAGE, value);

      if (value.from === this.getMasterTab()) {
        this.eventManger.trigger(EVENT_MESSAGE, value);
      }
    } // Fired every time something changes in the tab list (a tab registered/unregistered)

  }, {
    key: "handleUpdatedTabs",
    value: function handleUpdatedTabs() {
      var oldMaster = this.currentMasterTab;
      var newMaster = this.getMasterTab();
      this.currentMasterTab = newMaster;

      if (newMaster !== oldMaster) {
        if (newMaster === this.currentTab) {
          // The new master is the current tab
          this.didBecomeMasterTab();
        } else {
          debug('Master updated:', this.getMasterTab());
          clearInterval(this.heartbeatInterval);
          this.eventManger.trigger(EVENT_SURRENDER_MASTER);
        }
      }

      if (!this.isCurrentTabInTabList()) {
        this.reRegister();
      }
    } // Send a heartbeat through localStorage

  }, {
    key: "heartbeat",
    value: function heartbeat() {
      this.storage.setItem(STORAGE_HEARTBEAT, Date.now());
    } // Register callback

  }, {
    key: "onBecomeMaster",
    value: function onBecomeMaster(callback) {
      this.eventManger.addEventListener(EVENT_BECOME_MASTER, callback);
    } // No longer master, but not removed

  }, {
    key: "onSurrenderMaster",
    value: function onSurrenderMaster(callback) {
      this.eventManger.addEventListener(EVENT_SURRENDER_MASTER, callback);
    }
  }, {
    key: "onMessageFromMaster",
    value: function onMessageFromMaster(callback) {
      this.eventManger.addEventListener(EVENT_MESSAGE, callback);
    }
  }, {
    key: "onMessage",
    value: function onMessage(callback) {
      this.eventManger.addEventListener(EVENT_ANY_MESSAGE, callback);
    }
  }, {
    key: "onRemoved",
    value: function onRemoved(callback) {
      this.eventManger.addEventListener(EVENT_REMOVED, callback);
    } // Unregister tab (onbeforeunload)

  }, {
    key: "unregister",
    value: function unregister() {
      this.storage.removeItemChangeListener(STORAGE_TAB_LIST, this.handleUpdatedTabs);
      this.storage.removeArrayItem(STORAGE_TAB_LIST, this.currentTab);
    }
  }]);

  return TabManager;
}();

export { TabManager as default };
export { HEARTBEAT_INTERVAL, CHECK_MASTER_INTERVAL, CHECK_MASTER_THRESHOLD, STORAGE_HEARTBEAT, STORAGE_MESSAGE, STORAGE_TAB_LIST };