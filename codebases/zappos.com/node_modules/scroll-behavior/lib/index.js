"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _off = _interopRequireDefault(require("dom-helpers/events/off"));

var _on = _interopRequireDefault(require("dom-helpers/events/on"));

var _scrollLeft = _interopRequireDefault(require("dom-helpers/query/scrollLeft"));

var _scrollTop = _interopRequireDefault(require("dom-helpers/query/scrollTop"));

var _requestAnimationFrame = _interopRequireDefault(require("dom-helpers/util/requestAnimationFrame"));

var _invariant = _interopRequireDefault(require("invariant"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-underscore-dangle */
// Try at most this many times to scroll, to avoid getting stuck.
var MAX_SCROLL_ATTEMPTS = 2;

var ScrollBehavior =
/*#__PURE__*/
function () {
  function ScrollBehavior(_ref) {
    var _this = this;

    var addTransitionHook = _ref.addTransitionHook,
        stateStorage = _ref.stateStorage,
        getCurrentLocation = _ref.getCurrentLocation,
        shouldUpdateScroll = _ref.shouldUpdateScroll;

    this._restoreScrollRestoration = function () {
      /* istanbul ignore if: not supported by any browsers on Travis */
      if (_this._oldScrollRestoration) {
        try {
          window.history.scrollRestoration = _this._oldScrollRestoration;
        } catch (e) {
          /* silence */
        }
      }
    };

    this._onWindowScroll = function () {
      if (_this._ignoreScrollEvents) {
        // Don't save the scroll position until the transition is complete
        return;
      } // It's possible that this scroll operation was triggered by what will be a
      // `POP` transition. Instead of updating the saved location immediately, we
      // have to enqueue the update, then potentially cancel it if we observe a
      // location update.


      if (!_this._saveWindowPositionHandle) {
        _this._saveWindowPositionHandle = (0, _requestAnimationFrame["default"])(_this._saveWindowPosition);
      }

      if (_this._windowScrollTarget) {
        var _this$_windowScrollTa = _this._windowScrollTarget,
            xTarget = _this$_windowScrollTa[0],
            yTarget = _this$_windowScrollTa[1];
        var x = (0, _scrollLeft["default"])(window);
        var y = (0, _scrollTop["default"])(window);

        if (x === xTarget && y === yTarget) {
          _this._windowScrollTarget = null;

          _this._cancelCheckWindowScroll();
        }
      }
    };

    this._saveWindowPosition = function () {
      _this._saveWindowPositionHandle = null;

      _this._savePosition(null, window);
    };

    this._checkWindowScrollPosition = function () {
      _this._checkWindowScrollHandle = null; // We can only get here if scrollTarget is set. Every code path that unsets
      // scroll target also cancels the handle to avoid calling this handler.
      // Still, check anyway just in case.

      /* istanbul ignore if: paranoid guard */

      if (!_this._windowScrollTarget) {
        return Promise.resolve();
      }

      _this.scrollToTarget(window, _this._windowScrollTarget);

      ++_this._numWindowScrollAttempts;
      /* istanbul ignore if: paranoid guard */

      if (_this._numWindowScrollAttempts >= MAX_SCROLL_ATTEMPTS) {
        // This might happen if the scroll position was already set to the target
        _this._windowScrollTarget = null;
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        _this._checkWindowScrollHandle = (0, _requestAnimationFrame["default"])(function () {
          return resolve(_this._checkWindowScrollPosition());
        });
      });
    };

    this._stateStorage = stateStorage;
    this._getCurrentLocation = getCurrentLocation;
    this._shouldUpdateScroll = shouldUpdateScroll; // This helps avoid some jankiness in fighting against the browser's
    // default scroll behavior on `POP` transitions.

    /* istanbul ignore else: Travis browsers all support this */

    if ('scrollRestoration' in window.history && // Unfortunately, Safari on iOS freezes for 2-6s after the user swipes to
    // navigate through history with scrollRestoration being 'manual', so we
    // need to detect this browser and exclude it from the following code
    // until this bug is fixed by Apple.
    !(0, _utils.isMobileSafari)()) {
      this._oldScrollRestoration = window.history.scrollRestoration;

      try {
        window.history.scrollRestoration = 'manual'; // Scroll restoration persists across page reloads. We want to reset
        // this to the original value, so that we can let the browser handle
        // restoring the initial scroll position on server-rendered pages.

        (0, _on["default"])(window, 'beforeunload', this._restoreScrollRestoration);
      } catch (e) {
        this._oldScrollRestoration = null;
      }
    } else {
      this._oldScrollRestoration = null;
    }

    this._saveWindowPositionHandle = null;
    this._checkWindowScrollHandle = null;
    this._windowScrollTarget = null;
    this._numWindowScrollAttempts = 0;
    this._ignoreScrollEvents = false;
    this._scrollElements = {}; // We have to listen to each window scroll update rather than to just
    // location updates, because some browsers will update scroll position
    // before emitting the location change.

    (0, _on["default"])(window, 'scroll', this._onWindowScroll);
    this._removeTransitionHook = addTransitionHook(function () {
      _requestAnimationFrame["default"].cancel(_this._saveWindowPositionHandle);

      _this._saveWindowPositionHandle = null;
      Object.keys(_this._scrollElements).forEach(function (key) {
        var scrollElement = _this._scrollElements[key];

        _requestAnimationFrame["default"].cancel(scrollElement.savePositionHandle);

        scrollElement.savePositionHandle = null; // It's fine to save element scroll positions here, though; the browser
        // won't modify them.

        if (!_this._ignoreScrollEvents) {
          _this._saveElementPosition(key);
        }
      });
    });
  }

  var _proto = ScrollBehavior.prototype;

  _proto.registerElement = function registerElement(key, element, shouldUpdateScroll, context) {
    var _this2 = this;

    !!this._scrollElements[key] ? process.env.NODE_ENV !== "production" ? (0, _invariant["default"])(false, 'ScrollBehavior: There is already an element registered for `%s`.', key) : invariant(false) : void 0;

    var saveElementPosition = function saveElementPosition() {
      _this2._saveElementPosition(key);
    };

    var scrollElement = {
      element: element,
      shouldUpdateScroll: shouldUpdateScroll,
      savePositionHandle: null,
      onScroll: function onScroll() {
        if (!scrollElement.savePositionHandle && !_this2._ignoreScrollEvents) {
          scrollElement.savePositionHandle = (0, _requestAnimationFrame["default"])(saveElementPosition);
        }
      }
    }; // In case no scrolling occurs, save the initial position

    if (!scrollElement.savePositionHandle && !this._ignoreScrollEvents) {
      scrollElement.savePositionHandle = (0, _requestAnimationFrame["default"])(saveElementPosition);
    }

    this._scrollElements[key] = scrollElement;
    (0, _on["default"])(element, 'scroll', scrollElement.onScroll);

    this._updateElementScroll(key, null, context);
  };

  _proto.unregisterElement = function unregisterElement(key) {
    !this._scrollElements[key] ? process.env.NODE_ENV !== "production" ? (0, _invariant["default"])(false, 'ScrollBehavior: There is no element registered for `%s`.', key) : invariant(false) : void 0;
    var _this$_scrollElements = this._scrollElements[key],
        element = _this$_scrollElements.element,
        onScroll = _this$_scrollElements.onScroll,
        savePositionHandle = _this$_scrollElements.savePositionHandle;
    (0, _off["default"])(element, 'scroll', onScroll);

    _requestAnimationFrame["default"].cancel(savePositionHandle);

    delete this._scrollElements[key];
  };

  _proto.updateScroll = function updateScroll(prevContext, context) {
    var _this3 = this;

    this._updateWindowScroll(prevContext, context).then(function () {
      // Save the position immediately after a transition so that if no
      // scrolling occurs, there is still a saved position
      if (!_this3._saveWindowPositionHandle) {
        _this3._saveWindowPositionHandle = (0, _requestAnimationFrame["default"])(_this3._saveWindowPosition);
      }
    });

    Object.keys(this._scrollElements).forEach(function (key) {
      _this3._updateElementScroll(key, prevContext, context);
    });
  };

  _proto.stop = function stop() {
    this._restoreScrollRestoration();

    (0, _off["default"])(window, 'scroll', this._onWindowScroll);

    this._cancelCheckWindowScroll();

    this._removeTransitionHook();
  };

  _proto.startIgnoringScrollEvents = function startIgnoringScrollEvents() {
    this._ignoreScrollEvents = true;
  };

  _proto.stopIgnoringScrollEvents = function stopIgnoringScrollEvents() {
    this._ignoreScrollEvents = false;
  };

  _proto._cancelCheckWindowScroll = function _cancelCheckWindowScroll() {
    _requestAnimationFrame["default"].cancel(this._checkWindowScrollHandle);

    this._checkWindowScrollHandle = null;
  };

  _proto._saveElementPosition = function _saveElementPosition(key) {
    var scrollElement = this._scrollElements[key];
    scrollElement.savePositionHandle = null;

    this._savePosition(key, scrollElement.element);
  };

  _proto._savePosition = function _savePosition(key, element) {
    this._stateStorage.save(this._getCurrentLocation(), key, [(0, _scrollLeft["default"])(element), (0, _scrollTop["default"])(element)]);
  };

  _proto._updateWindowScroll = function _updateWindowScroll(prevContext, context) {
    // Whatever we were doing before isn't relevant any more.
    this._cancelCheckWindowScroll();

    this._windowScrollTarget = this._getScrollTarget(null, this._shouldUpdateScroll, prevContext, context); // Updating the window scroll position is really flaky. Just trying to
    // scroll it isn't enough. Instead, try to scroll a few times until it
    // works.

    this._numWindowScrollAttempts = 0;
    return this._checkWindowScrollPosition();
  };

  _proto._updateElementScroll = function _updateElementScroll(key, prevContext, context) {
    var _this$_scrollElements2 = this._scrollElements[key],
        element = _this$_scrollElements2.element,
        shouldUpdateScroll = _this$_scrollElements2.shouldUpdateScroll;

    var scrollTarget = this._getScrollTarget(key, shouldUpdateScroll, prevContext, context);

    if (!scrollTarget) {
      return;
    } // Unlike with the window, there shouldn't be any flakiness to deal with
    // here.


    this.scrollToTarget(element, scrollTarget);
  };

  _proto._getDefaultScrollTarget = function _getDefaultScrollTarget(location) {
    var hash = location.hash;

    if (hash && hash !== '#') {
      return hash.charAt(0) === '#' ? hash.slice(1) : hash;
    }

    return [0, 0];
  };

  _proto._getScrollTarget = function _getScrollTarget(key, shouldUpdateScroll, prevContext, context) {
    var scrollTarget = shouldUpdateScroll ? shouldUpdateScroll.call(this, prevContext, context) : true;

    if (!scrollTarget || Array.isArray(scrollTarget) || typeof scrollTarget === 'string') {
      return scrollTarget;
    }

    var location = this._getCurrentLocation();

    return this._getSavedScrollTarget(key, location) || this._getDefaultScrollTarget(location);
  };

  _proto._getSavedScrollTarget = function _getSavedScrollTarget(key, location) {
    if (location.action === 'PUSH') {
      return null;
    }

    return this._stateStorage.read(location, key);
  };

  _proto.scrollToTarget = function scrollToTarget(element, target) {
    if (typeof target === 'string') {
      var targetElement = document.getElementById(target) || document.getElementsByName(target)[0];

      if (targetElement) {
        targetElement.scrollIntoView();
        return;
      } // Fallback to scrolling to top when target fragment doesn't exist.


      target = [0, 0]; // eslint-disable-line no-param-reassign
    }

    var _target = target,
        left = _target[0],
        top = _target[1];
    (0, _scrollLeft["default"])(element, left);
    (0, _scrollTop["default"])(element, top);
  };

  return ScrollBehavior;
}();

exports["default"] = ScrollBehavior;
module.exports = exports.default;