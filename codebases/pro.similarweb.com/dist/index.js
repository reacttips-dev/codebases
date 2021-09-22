module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("@similarweb/sw-log");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_TrackBuffer__ = __webpack_require__(5);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Base Tracker Class
 * contains some base implementations
 */
var BaseTracker =
/*#__PURE__*/
function () {
  function BaseTracker() {
    _classCallCheck(this, BaseTracker);

    _defineProperty(this, "buffer", new __WEBPACK_IMPORTED_MODULE_1__utils_TrackBuffer__["a" /* TrackBuffer */](this.shouldBuffer));
  }

  _createClass(BaseTracker, [{
    key: "trackEvent",
    value: function trackEvent(category, action, name, value) {
      if (this.enabled()) {
        this.trackEventInternal(category, action, name, value);
      }
    }
  }, {
    key: "trackPageView",
    value: function trackPageView(customDimsData) {
      if (this.enabled()) {
        this.trackPageViewInternal(customDimsData);
      }
    }
  }, {
    key: "healthCheck",
    value: function healthCheck() {
      if (this.enabled()) {
        this.healthCheckInternal();
      }
    }
  }, {
    key: "getBuffer",
    value: function getBuffer() {
      return this.buffer;
    }
  }, {
    key: "runCustomAction",
    value: function runCustomAction(action) {
      var actionName = "".concat(action, "Action");

      if (typeof this[actionName] === "function") {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        this[actionName].apply(this, args);
      } else {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.error("Base tracker: missing action '".concat(action, "' on tracker"));
      }
    }
  }, {
    key: "enabled",
    value: function enabled() {
      return this.isEnabled();
    }
  }, {
    key: "shouldBuffer",
    value: function shouldBuffer() {
      return false;
    }
  }]);

  return BaseTracker;
}();

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomDimensions; });
/* harmony export (immutable) */ __webpack_exports__["b"] = trackerWithConsole;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__AggregatedTracker__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ConsoleTracker__ = __webpack_require__(4);



/**
 * custom dimensions and their IDs
 * @type {{string: number}}
 */
var CustomDimensions = {
  path: 1,
  lang: 2,
  is_sw_user: 3,
  query: 4,
  entity: 5,
  filters: 6,
  category: 7,
  identity: 8,
  custom_data: 9
};
function trackerWithConsole(tracker, name) {
  return new __WEBPACK_IMPORTED_MODULE_0__AggregatedTracker__["a" /* AggregatedTracker */]([tracker, new __WEBPACK_IMPORTED_MODULE_1__ConsoleTracker__["a" /* ConsoleTracker */](name)]);
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AggregatedTracker; });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * A tracker that runs an a list of trackers for every method.
 * Trackers are run if ITrack.enable() return true;
 */
var AggregatedTracker =
/*#__PURE__*/
function () {
  function AggregatedTracker(trackers) {
    _classCallCheck(this, AggregatedTracker);

    _defineProperty(this, "trackers", []);

    this.trackers = trackers.slice();
  }

  _createClass(AggregatedTracker, [{
    key: "trackEvent",
    value: function trackEvent(category, action, name, value) {
      this.trackers.forEach(function (tracker) {
        return tracker.trackEvent(category, action, name, value);
      });
    }
  }, {
    key: "trackPageView",
    value: function trackPageView(customDimsData) {
      this.trackers.forEach(function (tracker) {
        return tracker.trackPageView(customDimsData);
      });
    }
  }, {
    key: "healthCheck",
    value: function healthCheck() {
      this.trackers.forEach(function (tracker) {
        return tracker.healthCheck();
      });
    }
  }, {
    key: "getBuffer",
    value: function getBuffer() {
      throw new Error("Not implemented: call getBuffer() on the individual tracker");
    }
  }, {
    key: "runCustomAction",
    value: function runCustomAction(action) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.trackers.forEach(function (tracker) {
        return tracker.runCustomAction.apply(tracker, [action].concat(args));
      });
    }
  }, {
    key: "getTrackers",
    value: function getTrackers() {
      return _objectSpread({}, this.trackers);
    }
  }]);

  return AggregatedTracker;
}();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConsoleTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/**
 * a Dummy tracker that only writes to console
 * for debug purposes
 */
var ConsoleTracker =
/*#__PURE__*/
function () {
  function ConsoleTracker(name) {
    _classCallCheck(this, ConsoleTracker);

    this.name = name;
  }

  _createClass(ConsoleTracker, [{
    key: "trackEvent",
    value: function trackEvent() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.log("trackEvent(".concat(args.join(","), ")"));
    }
  }, {
    key: "trackPageView",
    value: function trackPageView(urlParams) {
      this.log("trackPageView(): ".concat(JSON.stringify(urlParams)));
    }
  }, {
    key: "healthCheck",
    value: function healthCheck() {
      this.log("healthCheck()");
    }
  }, {
    key: "runCustomAction",
    value: function runCustomAction(action) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      this.log.apply(this, ["runAction(".concat(action, ")")].concat(args));
    }
  }, {
    key: "getBuffer",
    value: function getBuffer() {
      return null;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      switch (args.length) {
        case 1:
          __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.info("%c".concat(this.name, ": ").concat(args[0]), ConsoleTracker.LOG_STYLE);
          break;

        default:
          __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.info.apply(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a, ["%c".concat(this.name, ": ").concat(args[0]), ConsoleTracker.LOG_STYLE].concat(_toConsumableArray(args.slice(1))));
          break;
      }
    }
  }]);

  return ConsoleTracker;
}();

_defineProperty(ConsoleTracker, "LOG_STYLE", "color:blue");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrackBuffer; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Buffer for Tracking functionality.
 * Useful for throttling, and testing.
 */
var TrackBuffer =
/*#__PURE__*/
function () {
  function TrackBuffer(shouldBuffer) {
    _classCallCheck(this, TrackBuffer);

    _defineProperty(this, "shouldBuffer", void 0);

    _defineProperty(this, "rawBuffer", []);

    this.shouldBuffer = shouldBuffer;
  }

  _createClass(TrackBuffer, [{
    key: "add",
    value: function add(item) {
      if (this.shouldBuffer()) {
        this.rawBuffer.push(item);
      }
    }
  }, {
    key: "flush",
    value: function flush() {
      var tmp = this.rawBuffer;
      this.rawBuffer = [];
      return tmp;
    }
  }]);

  return TrackBuffer;
}();

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trackers_ITrack__ = __webpack_require__(2);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "CustomDimensions", function() { return __WEBPACK_IMPORTED_MODULE_0__trackers_ITrack__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "trackerWithConsole", function() { return __WEBPACK_IMPORTED_MODULE_0__trackers_ITrack__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trackers_AggregatedTracker__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AggregatedTracker", function() { return __WEBPACK_IMPORTED_MODULE_1__trackers_AggregatedTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__trackers_BaseTracker__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "BaseTracker", function() { return __WEBPACK_IMPORTED_MODULE_2__trackers_BaseTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trackers_ConsoleTracker__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ConsoleTracker", function() { return __WEBPACK_IMPORTED_MODULE_3__trackers_ConsoleTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__trackers_GoogleTracker__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "GoogleTracker", function() { return __WEBPACK_IMPORTED_MODULE_4__trackers_GoogleTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__trackers_IntercomTracker__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "IntercomTracker", function() { return __WEBPACK_IMPORTED_MODULE_5__trackers_IntercomTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__trackers_MunchkinTracker__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MunchkinTracker", function() { return __WEBPACK_IMPORTED_MODULE_6__trackers_MunchkinTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__trackers_PiwikTracker__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PiwikTracker", function() { return __WEBPACK_IMPORTED_MODULE_7__trackers_PiwikTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__trackers_MixpanelTracker__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MixpanelTracker", function() { return __WEBPACK_IMPORTED_MODULE_8__trackers_MixpanelTracker__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__utils_TrackBuffer__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TrackBuffer", function() { return __WEBPACK_IMPORTED_MODULE_9__utils_TrackBuffer__["a"]; });











/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseTracker__ = __webpack_require__(1);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




/**
 * A Tracker for Google Analytics
 */
var GoogleTracker =
/*#__PURE__*/
function (_BaseTracker) {
  _inherits(GoogleTracker, _BaseTracker);

  function GoogleTracker() {
    _classCallCheck(this, GoogleTracker);

    return _possibleConstructorReturn(this, _getPrototypeOf(GoogleTracker).apply(this, arguments));
  }

  _createClass(GoogleTracker, [{
    key: "trackPageViewInternal",
    value: function trackPageViewInternal(customDimsData) {
      try {
        var _ga = this.ga();

        if (_ga) {
          _ga("send", "pageview", "/" + document.location.hash);
        }
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in google analytics", e);
      }
    }
  }, {
    key: "trackEventInternal",
    value: function trackEventInternal(category, action, name, value) {
      try {
        var _ga2 = this.ga();

        if (_ga2) {
          _ga2("send", "event", category, action, name, value);
        }
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in google analytics", e);
      }
    }
  }, {
    key: "healthCheckInternal",
    value: function healthCheckInternal() {
      // check GTM:
      if (!false && !window["google_tag_manager"]) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.serverLogger("GTM not loaded", null, "Info");
      }
    }
    /**
     * get the native tracker
     */

  }]);

  return GoogleTracker;
}(__WEBPACK_IMPORTED_MODULE_1__BaseTracker__["a" /* BaseTracker */]);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntercomTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseTracker__ = __webpack_require__(1);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




/**
 * A Tracker for Intercom
 */
var IntercomTracker =
/*#__PURE__*/
function (_BaseTracker) {
  _inherits(IntercomTracker, _BaseTracker);

  function IntercomTracker() {
    _classCallCheck(this, IntercomTracker);

    return _possibleConstructorReturn(this, _getPrototypeOf(IntercomTracker).apply(this, arguments));
  }

  _createClass(IntercomTracker, [{
    key: "updateAction",
    value: function updateAction() {
      if (typeof this.intercom() !== "function") {
        return;
      }

      try {
        this.intercom()("update");
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.warn("Error in intercom tracking", e);
      }
    }
  }, {
    key: "trackEventInternal",
    value: function trackEventInternal(category, action, name) {
      var intercom = this.intercom();

      if (typeof intercom !== "function") {
        return;
      }

      var params = {
        event_category: category,
        event_action: action,
        event_name: name
      };

      try {
        intercom("trackEvent", "".concat(category, "/").concat(action), params);
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.warn("Error in intercom tracking", e);
      }
    }
  }, {
    key: "trackPageViewInternal",
    value: function trackPageViewInternal(customDimsData) {// nothing
    }
  }, {
    key: "healthCheckInternal",
    value: function healthCheckInternal() {} // nothing

    /**
     * get the native tracker
     */

  }]);

  return IntercomTracker;
}(__WEBPACK_IMPORTED_MODULE_1__BaseTracker__["a" /* BaseTracker */]);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MunchkinTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BaseTracker__ = __webpack_require__(1);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var MunchkinTracker =
/*#__PURE__*/
function (_BaseTracker) {
  _inherits(MunchkinTracker, _BaseTracker);

  function MunchkinTracker() {
    _classCallCheck(this, MunchkinTracker);

    return _possibleConstructorReturn(this, _getPrototypeOf(MunchkinTracker).apply(this, arguments));
  }

  _createClass(MunchkinTracker, [{
    key: "updateLeadAction",
    value: function updateLeadAction(fieldMap, user) {
      // add mandatory fields
      fieldMap.Email = user.username;
      fieldMap.FirstName = user.firstname;
      fieldMap.LastName = user.lastname;
      return fetch(this.marketoEndpoint(), {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fieldMap)
      });
    }
  }, {
    key: "clickLinkAction",
    value: function clickLinkAction(href) {
      try {
        var _munchkin = this.munchkin();

        if (_munchkin) {
          _munchkin("clickLink", {
            href: href
          });
        }
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in munchkin", e);
      }
    }
  }, {
    key: "associateLeadAction",
    value: function associateLeadAction(fieldMap) {
      try {
        this.munchkin()("associateLead", fieldMap);
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in munchkin", e);
      }
    }
  }, {
    key: "trackPageViewInternal",
    value: function trackPageViewInternal(customDimsData) {
      try {
        // TODO: verify the change in munchkin
        var _munchkin2 = this.munchkin();

        if (_munchkin2) {
          _munchkin2("visitWebPage", {
            url: this.location()
          });
        }
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in munchkin", e);
      }
    }
  }, {
    key: "trackEventInternal",
    value: function trackEventInternal(category, action, label, value) {
      this.clickLinkAction("/" + category + "/" + action + "/" + label);
    }
  }, {
    key: "healthCheckInternal",
    value: function healthCheckInternal() {
      if (!false && window["GTM"] && window["GTM"].marketo.enabled && (!window["Munchkin"] || !window["Munchkin"].munchkinFunction)) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.serverLogger("Munchkin is not loaded", null, "Info");
      }
    }
    /**
     * getter for the native tracker
     */

  }]);

  return MunchkinTracker;
}(__WEBPACK_IMPORTED_MODULE_1__BaseTracker__["a" /* BaseTracker */]);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PiwikTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isempty__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_isempty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_isempty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BaseTracker__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ITrack__ = __webpack_require__(2);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





var PiwikTracker =
/*#__PURE__*/
function (_BaseTracker) {
  _inherits(PiwikTracker, _BaseTracker);

  function PiwikTracker() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, PiwikTracker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PiwikTracker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "customUrl", "");

    return _this;
  }

  _createClass(PiwikTracker, [{
    key: "trackEventInternal",
    value: function trackEventInternal(category, action, name, value) {
      try {
        var _paq = this.paq();

        if (_paq) {
          _paq.push(["trackEvent", category, action, name, value]);
        }

        this.getBuffer().add(["trackEvent", category, action, name, value, this.customUrl]);
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in piwik analytics", e);
      }
    }
  }, {
    key: "trackPageViewInternal",
    value: function trackPageViewInternal(customDimsData) {
      try {
        this.paq().push(["setCustomUrl", window.location.href]);
        this.setCustomDimensions(customDimsData);
        this.paq().push(["trackPageView"]);
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in piwik analytics", e);
      }
    }
  }, {
    key: "healthCheckInternal",
    value: function healthCheckInternal() {
      var paq = this.paq();

      if (!paq || Array.isArray(paq) && paq.length > 5) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.serverLogger("Piwik is not loaded", null, "Info");
      }
    }
    /**
     * getter for the native tracker
     */

  }, {
    key: "getDimensions",

    /**
     * getter for the custom dimensions ids
     */
    value: function getDimensions() {
      return __WEBPACK_IMPORTED_MODULE_3__ITrack__["a" /* CustomDimensions */];
    }
  }, {
    key: "setCustomDimension",
    value: function setCustomDimension(customDimensionId, customDimensionValue) {
      this.paq().push(["setCustomDimension", customDimensionId, encodeURIComponent(JSON.stringify(customDimensionValue))]);
    }
  }, {
    key: "deleteCustomDimension",
    value: function deleteCustomDimension(customDimensionId) {
      this.paq().push(["deleteCustomDimension", customDimensionId]);
    }
  }, {
    key: "setCustomDimensions",
    value: function setCustomDimensions(customDimsData) {
      var _this2 = this;

      var dimensions = this.getDimensions();
      Object.keys(dimensions).forEach(function (key) {
        var value = customDimsData && customDimsData[key];

        var type = _typeof(value);

        var hasValue = type === "object" && !__WEBPACK_IMPORTED_MODULE_1_lodash_isempty__(value) || type === "boolean" || type === "string";
        var dimensionId = dimensions[key];

        if (hasValue) {
          _this2.setCustomDimension(dimensionId, value);
        } else {
          _this2.deleteCustomDimension(dimensionId);
        }
      });
    }
  }, {
    key: "setPostRequests",
    value: function setPostRequests() {
      this.paq().push(["setRequestMethod", "POST"]);
    }
  }]);

  return PiwikTracker;
}(__WEBPACK_IMPORTED_MODULE_2__BaseTracker__["a" /* BaseTracker */]);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' ||
        typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (nonEnumShadows || isPrototype(value)) {
    return !nativeKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEmpty;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12), __webpack_require__(13)(module)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MixpanelTracker; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_FullStory__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BaseTracker__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__MixpanelProperties__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sessionIdGenerator__ = __webpack_require__(17);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var TRACK_PAGE_VIEW_KEY = "PageView";
var MixpanelTracker =
/*#__PURE__*/
function (_BaseTracker) {
  _inherits(MixpanelTracker, _BaseTracker);

  function MixpanelTracker() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MixpanelTracker);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MixpanelTracker)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "timeout", 1800000);

    _defineProperty(_assertThisInitialized(_this), "setSessionId", function (mixpanel) {
      mixpanel.register({
        session_id: Object(__WEBPACK_IMPORTED_MODULE_4__sessionIdGenerator__["a" /* default */])(),
        session_first_event_time: new Date()
      });
    });

    _defineProperty(_assertThisInitialized(_this), "ensureSessionId", function () {
      var mixpanel = _this.mixpanel();

      if (!mixpanel) {
        return;
      }

      if (!("get_property" in mixpanel)) {
        return;
      }

      if (!mixpanel.get_property("last_event_time") || !mixpanel.get_property("session_id")) {
        // Super properties are persisted in cookies, so when a property is deprectaed or renamed,
        // it needs to be manually unregistered, or Mixpanel will keep sending it until the cookie is cleared for some reason
        // This call will remove deprected properties before starting a new session.
        // This method is used instead of mixpanel.reset(), so we don't loose data.
        _this.unregisterDeprecatedProperties(mixpanel);

        _this.setSessionId(mixpanel);
      } // Need to add the unary '+' so TS linter doesn't get mad
      // that we are subtracting non-numerical values
      // this is that valueOf of a Date object is a number


      var parsedDate = +new Date(mixpanel.get_property("last_event_time"));

      if (Math.abs(+Date.now() - parsedDate) > _this.timeout) {
        _this.setSessionId(mixpanel);
      }
    });

    return _this;
  }

  _createClass(MixpanelTracker, [{
    key: "trackPageViewInternal",
    value: function trackPageViewInternal(customDimsData) {
      try {
        var _mixpanel = this.mixpanel();

        if (!_mixpanel) {
          return;
        }

        var customDimentions = _objectSpread({
          url: window.location.href,
          is_sw_user: customDimsData.is_sw_user,
          language: customDimsData.lang
        }, customDimsData.path, {}, customDimsData.query, {}, customDimsData.entity, {}, customDimsData.filters, {}, customDimsData.category, {}, customDimsData.identity, {}, customDimsData.custom_data); // If FullStory is loaded, add the session URL to the event metadata


        if (Object(__WEBPACK_IMPORTED_MODULE_1__utils_FullStory__["b" /* isFsLoaded */])()) {
          customDimentions["Fullstory Session"] = Object(__WEBPACK_IMPORTED_MODULE_1__utils_FullStory__["a" /* getUrlWithTime */])();
        }

        this.ensureSessionId(); // Some properties are used in some pages
        // and also events associated with these pages.
        // We want to reset these properties so they aren't
        // sent in pages where they aren't explicitly set.

        this.resetProperties(_mixpanel);

        _mixpanel.register(_objectSpread({}, customDimentions, {
          last_event_time: Date.now()
        }));

        _mixpanel.track(TRACK_PAGE_VIEW_KEY);
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in sending pageview to Mixpanel", e);
      }
    }
  }, {
    key: "trackEventInternal",
    value: function trackEventInternal(category, action, name, value) {
      try {
        var _mixpanel2 = this.mixpanel();

        if (!_mixpanel2) {
          return;
        }

        this.ensureSessionId();

        _mixpanel2.register({
          last_event_time: Date.now()
        });

        if (Array.isArray(category) && category[0] === "PageError") {
          _mixpanel2.track(category[0], {
            properties: {
              path: category[1],
              error_status_code: category[2]
            }
          });
        } else {
          var nameParams = name.split("/");
          var eventParams = {
            category: category,
            action: action,
            event_full_name: name,
            event_name: nameParams[0] || "none",
            event_sub_name: nameParams[1] || "none",
            event_sub_sub_name: nameParams[2] || "none",
            value: value,
            custom_url: window.location.href
          }; // If FullStory is loaded, add the session URL to the event metadata

          if (Object(__WEBPACK_IMPORTED_MODULE_1__utils_FullStory__["b" /* isFsLoaded */])()) {
            eventParams["Fullstory Session"] = Object(__WEBPACK_IMPORTED_MODULE_1__utils_FullStory__["a" /* getUrlWithTime */])();
          }

          _mixpanel2.track(category, eventParams);
        }
      } catch (e) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.exception("Error in sending Mixpanel event ", e);
      }
    }
  }, {
    key: "healthCheckInternal",
    value: function healthCheckInternal() {
      var mixpanel = this.mixpanel();

      if (!mixpanel) {
        return;
      }

      if (!("get_property" in mixpanel)) {
        return;
      } // check GTM:


      if (!false && !window["google_tag_manager"]) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.serverLogger("GTM not loaded", null, "Info");
      } // Check that the mixpanel script is loaded and initialized


      if (!false && !mixpanel) {
        __WEBPACK_IMPORTED_MODULE_0__similarweb_sw_log___default.a.serverLogger("Mixpanel is not loaded", null, "Info");
      }
    }
  }, {
    key: "shouldBuffer",
    value: function shouldBuffer() {
      return false;
    }
  }, {
    key: "resetProperties",
    value: function resetProperties(mixpanel) {
      // The async part of Mixpanel is required
      // to interact with super properties.
      // We need to validate it's loaded and initialized
      if (!("get_property" in mixpanel)) {
        return;
      }

      __WEBPACK_IMPORTED_MODULE_3__MixpanelProperties__["b" /* propertiesToResetOnPageview */].forEach(function (prop) {
        mixpanel.unregister(prop);
      });
    }
  }, {
    key: "unregisterDeprecatedProperties",
    value: function unregisterDeprecatedProperties(mixpanel) {
      __WEBPACK_IMPORTED_MODULE_3__MixpanelProperties__["a" /* deprecatedProperties */].forEach(function (elm) {
        mixpanel.unregister(elm);
      });
    }
  }]);

  return MixpanelTracker;
}(__WEBPACK_IMPORTED_MODULE_2__BaseTracker__["a" /* BaseTracker */]);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isFsLoaded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getUrlWithTime; });
/* unused harmony export getUrl */
var SESSION_URL_FUNCTION_NAME = "getCurrentSessionURL";

var fs = function fs() {
  var fsNamespace = window["_fs_namespace"];
  return window[fsNamespace];
};

var isFsLoaded = function isFsLoaded() {
  var fsObject = fs();

  if (fsObject && typeof fsObject[SESSION_URL_FUNCTION_NAME] === "function") {
    return true;
  }

  return false;
};
var getUrlWithTime = function getUrlWithTime() {
  return fs()[SESSION_URL_FUNCTION_NAME](true);
};
var getUrl = function getUrl() {
  return fs()[SESSION_URL_FUNCTION_NAME]();
};

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return deprecatedProperties; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return propertiesToResetOnPageview; });
var deprecatedProperties = ["session ID", "last event time", "Site Type"];
var propertiesToResetOnPageview = ["date_range", "domain_type", "entity_id", "entity_name", "main_category", "sub_category", "sub_sub_category", "tab", "ab_test_name", "ab_test_value", "custom_category_id", "custom_category_name", "order_by", "page", "device_os", "store"];

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getSessionId;
function getSessionId() {
  var crypto = window.crypto || window.msCrypto;

  if (crypto) {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
  } else {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      // tslint:disable-next-line:no-bitwise
      var r = Math.random() * 16 | 0; // tslint:disable-next-line:no-bitwise

      var v = c === "x" ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
}

/***/ })
/******/ ]);


// WEBPACK FOOTER //
// dist/index.js