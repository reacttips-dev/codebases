import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import debounce from 'hs-lodash/debounce';
import sendRecentFeedback from 'unified-navigation-ui/utils/sendRecentFeedback';
var MOBILE_CUTOFF_WIDTH = 1024;
var mobile = false;

var Application = /*#__PURE__*/function () {
  function Application() {
    _classCallCheck(this, Application);
  }

  _createClass(Application, [{
    key: "isMobile",
    // Kicks off the app. This is intentionally not in the constructor just in
    // Case there is a reason you need to explicitly call init (and don't want it
    // Auto-called by importing this module)
    value: function isMobile() {
      return window.innerWidth <= MOBILE_CUTOFF_WIDTH;
    }
  }, {
    key: "callback",
    value: function callback() {
      var navbar = document.getElementById('navbar');
      var navTopLevel = document.getElementById('hs-nav-v4');

      var resizeHandler = function resizeHandler() {
        if (window.innerWidth <= MOBILE_CUTOFF_WIDTH && !mobile) {
          document.dispatchEvent(new CustomEvent('switchedToMobile'));
          navbar.classList.add('mobile');
          navTopLevel.classList.add('accounts-weird');
          mobile = true;
        } else if (window.innerWidth > MOBILE_CUTOFF_WIDTH && mobile) {
          document.dispatchEvent(new CustomEvent('switchedToDesktop'));
          navbar.classList.remove('mobile');
          navTopLevel.classList.remove('accounts-weird');
          mobile = false;
        }
      };

      window.addEventListener('resize', debounce(resizeHandler, 66), false);

      if (this.isMobile()) {
        mobile = true;
        document.dispatchEvent(new CustomEvent('switchedToMobile'));
        navbar.classList.add('mobile');
        navTopLevel.classList.add('accounts-weird');
      } else {
        document.dispatchEvent(new CustomEvent('switchedToDesktop'));
      }
    }
  }, {
    key: "start",
    value: function start(render) {
      this.setupCustomEventPolyfill();
      render(this.callback.bind(this));
      sendRecentFeedback();
    }
  }, {
    key: "setupCustomEventPolyfill",
    value: function setupCustomEventPolyfill() {
      if (typeof window.CustomEvent !== 'function') {
        var _CustomEvent = function _CustomEvent(event, params) {
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };

        _CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = _CustomEvent;
      }
    }
  }]);

  return Application;
}();

export { Application as default };