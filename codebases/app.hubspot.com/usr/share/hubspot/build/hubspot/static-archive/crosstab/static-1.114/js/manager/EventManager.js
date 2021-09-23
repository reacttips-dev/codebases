'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    _classCallCheck(this, EventManager);

    this.callbacks = {};
  }

  _createClass(EventManager, [{
    key: "addEventListener",
    value: function addEventListener(eventName, handler) {
      if (!this.callbacks[eventName]) {
        this.callbacks[eventName] = [];
      }

      this.callbacks[eventName].push(handler);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, handler) {
      this.callbacks[eventName] = this.callbacks[eventName].filter(function (eventHandler) {
        return eventHandler !== handler;
      });
    }
  }, {
    key: "trigger",
    value: function trigger(eventName) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.callbacks[eventName]) {
        this.callbacks[eventName].forEach(function (handler) {
          return handler.apply(void 0, args);
        });
      }
    }
  }]);

  return EventManager;
}();

export { EventManager as default };