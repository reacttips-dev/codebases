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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SwLog = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Fatal"] = 0] = "Fatal";
  LogLevel[LogLevel["Error"] = 1] = "Error";
  LogLevel[LogLevel["Warn"] = 2] = "Warn";
  LogLevel[LogLevel["Info"] = 3] = "Info";
  LogLevel[LogLevel["Debug"] = 4] = "Debug";
  LogLevel[LogLevel["Trace"] = 5] = "Trace";
})(LogLevel || (LogLevel = {}));

var METHODS = ["debug", "error", "info", "log", "warn", "dir", "dirxml", "table", "trace", "assert", "count", "markTimeline", "profile", "profileEnd", "time", "timeEnd", "timeStamp", "timeline", "timelineEnd", "group", "groupCollapsed", "groupEnd", "clear"];
var IGNORE_DEBUG = ["error", "warn"];
var _mute = false; // console wrapper

var logger = {
  /**
   *
   * A log call sent tpo the backend
   * @param message
   * @param e
   * @param level
   * The following are the allowed log levels (in descending order):
   * Fatal, Error, Warn, Info, Debug, Trace
   * @returns a {Promise<Response>} to the server log fetch
   */
  serverLogger: function serverLogger(message, e) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Error";
    var extraHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var stack = e && e.stack || new Error().stack;
    var headers = new Headers(_objectSpread({
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }, extraHeaders)); // post error to the server

    return fetch("/api/exception", {
      method: "POST",
      credentials: "include",
      headers: headers,
      body: JSON.stringify({
        message: message,
        stack: stack,
        url: window.location.href,
        level: level
      })
    });
  },

  /**
   *
   * log an Exception locally, and in the backend
   * @param message
   * @param e
   * @returns a {Promise<Response>} to the server log fetch
   */
  exception: function exception(message, e) {
    if (!e) {
      this.error(message);
      return;
    }

    var msg = message + ": " + e.message;
    this.error(msg, e);
    return this.serverLogger(msg, e);
  },
  mute: function mute() {
    _mute = true;
  },
  unmute: function unmute() {
    _mute = false;
  }
}; // init stubs

for (var i = 0; i < METHODS.length; i++) {
  logger[METHODS[i]] = function () {};
} // try window.console


if (typeof window.console !== "undefined") {
  (function () {
    var impl = window.console;

    for (var name in impl) {
      var func = impl[name];

      if (typeof func === "function" && typeof func.apply === "function") {
        // attach impl
        (function (funcName) {
          logger[funcName] = function () {
            if (!_mute && (false || IGNORE_DEBUG.indexOf(funcName) > -1)) {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              impl[funcName].apply(impl, args);
            }
          };
        })(name);
        /* jshint loopfunc:false */

      }
    }
  })();
}

var SwLog = logger;
exports.SwLog = SwLog;
var _default = SwLog;
exports["default"] = _default;

/***/ })
/******/ ]);


// WEBPACK FOOTER //
// dist/sw-log.prod.js