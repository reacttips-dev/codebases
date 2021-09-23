'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import getLang from 'I18n/utils/getLang';
import PropTypes from 'prop-types';
import { Component } from 'react';
import enviro from 'enviro';
import PortalIdParser from 'PortalIdParser';
import userInfo from 'hub-http/userInfo';
import injectScript from './utils/injectScript';
var ENV = enviro.getShort();
var qaSuffix = ENV === 'qa' ? 'qa' : '';

var getLocalStorageItem = function getLocalStorageItem(key) {
  try {
    return window.localStorage && window.localStorage.getItem(key);
  } catch (err) {
    console.error(err);
    return null;
  }
};

var loadLocalPopupInjector = getLocalStorageItem('LOCAL_FEEDBACK_UI') === 'true';
var PORTAL_ID_ATTR = 'data-hubspot-feedback-portal-id';
var CUSTOMER_PORTAL_ID_ATTR = 'data-hubspot-feedback-customer-portal-id';
var ENV_ATTR = 'data-hubspot-feedback-env';
var HUBSPOT_APP_ATTR = 'data-hubspot-feedback-hubspot-app';
var HUBSPOT_EMAIL_ATTR = 'data-hubspot-feedback-hubspot-email';
var HUBSPOT_USER_LANG = 'data-hubspot-feedback-user-lang';
var SELENIUM_DISABLE_FEEDBACK_KEY = 'selenium.disable.feedback-surveys';
var hsq = window._hsq = window._hsq || [];
hsq.push(['setCookiePolicy', [{
  enabled: true,
  privacyPolicy: 2,
  privacyDefault: true
}]]);

var addOnClientReadyCallback = function addOnClientReadyCallback(onReady) {
  window.onHsFeedbackReady = window.onHsFeedbackReady || [];
  window.onHsFeedbackReady.push(onReady);
};

var inject = function inject(portalId, customerPortalId, userInfoClient, onClientLoad) {
  var ANALYTICS_SRC = "//js.hubspot" + qaSuffix + ".com/analytics/0/common.js";
  var FEEDBACK_INJECTOR_SRC = loadLocalPopupInjector ? "//local.hsappstatic.net/feedback-web-renderer-ui/static/bundles/popupInjector.js" : "//js.hubspotfeedback" + qaSuffix + ".com/feedbackweb-new.js";
  injectScript(ANALYTICS_SRC);
  userInfoClient().then(function (_ref) {
    var _injectScript;

    var user = _ref.user,
        hubspotter = _ref.hubspotter;

    var _ref2 = user || hubspotter,
        email = _ref2.email;

    hsq.push(['identify', {
      email: email
    }]);
    injectScript(FEEDBACK_INJECTOR_SRC, (_injectScript = {}, _defineProperty(_injectScript, PORTAL_ID_ATTR, portalId), _defineProperty(_injectScript, CUSTOMER_PORTAL_ID_ATTR, customerPortalId), _defineProperty(_injectScript, ENV_ATTR, ENV), _defineProperty(_injectScript, HUBSPOT_APP_ATTR, true), _defineProperty(_injectScript, HUBSPOT_EMAIL_ATTR, email), _defineProperty(_injectScript, HUBSPOT_USER_LANG, getLang()), _injectScript));

    if (onClientLoad) {
      addOnClientReadyCallback(onClientLoad);
    }
  });
};

var FeedbackLoader = /*#__PURE__*/function (_Component) {
  _inherits(FeedbackLoader, _Component);

  function FeedbackLoader(props) {
    var _this;

    _classCallCheck(this, FeedbackLoader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FeedbackLoader).call(this, props));
    var customerPortalId = props.customerPortalId,
        delayMs = props.delayMs,
        onClientLoad = props.onClientLoad,
        portalId = props.portalId,
        userInfoClient = props.userInfoClient;

    if (window.hsFeedbackLoaded || window.disabledHsPopups && window.disabledHsPopups.indexOf('FEEDBACK') > -1 || getLocalStorageItem(SELENIUM_DISABLE_FEEDBACK_KEY) === 'true') {
      return _possibleConstructorReturn(_this);
    }

    hsq.push(['setPortalId', portalId]);
    setTimeout(function () {
      inject(portalId, customerPortalId, userInfoClient, onClientLoad);
    }, delayMs);
    return _this;
  }

  _createClass(FeedbackLoader, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return false;
    }
  }, {
    key: "render",
    value: function render() {
      return null;
    }
  }]);

  return FeedbackLoader;
}(Component);

export { FeedbackLoader as default };
FeedbackLoader.propTypes = {
  customerPortalId: PropTypes.number,
  delayMs: PropTypes.number,
  onClientLoad: PropTypes.func,
  portalId: PropTypes.number,
  userInfoClient: PropTypes.func
};
FeedbackLoader.defaultProps = {
  customerPortalId: PortalIdParser.get(),
  delayMs: 0,
  portalId: ENV === 'prod' ? 53 : 100765651,
  userInfoClient: userInfo
};