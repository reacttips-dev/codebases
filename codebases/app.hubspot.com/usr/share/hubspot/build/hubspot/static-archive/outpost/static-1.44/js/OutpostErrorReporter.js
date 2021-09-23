'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { getEmbedAppReportingUrl, getHubspotReportingUrl } from './domain';
import { contains, extend, stringifyCookies } from './util';

var getBaseUrl = function getBaseUrl(_ref) {
  var _ref$isEmbedApp = _ref.isEmbedApp,
      isEmbedApp = _ref$isEmbedApp === void 0 ? false : _ref$isEmbedApp,
      _ref$env = _ref.env,
      env = _ref$env === void 0 ? 'PROD' : _ref$env,
      _ref$hublet = _ref.hublet,
      hublet = _ref$hublet === void 0 ? '' : _ref$hublet;
  var isQa = env !== 'PROD';

  if (!isEmbedApp) {
    return getHubspotReportingUrl({
      isQa: isQa,
      hublet: hublet
    });
  }

  return getEmbedAppReportingUrl({
    isQa: isQa,
    hublet: hublet
  });
};

var OutpostErrorReporter = /*#__PURE__*/function () {
  function OutpostErrorReporter(projectName, opts) {
    _classCallCheck(this, OutpostErrorReporter);

    opts = opts || {};

    if (!projectName) {
      console.warn('The projectName parameter is required');
    }

    this.projectName = projectName;
    this.env = (opts.env || 'PROD').toUpperCase();
    this.hublet = opts.hublet || '';
    this.isEmbedApp = opts.isEmbedApp || false;
    this.level = (opts.level || 'ERROR').toUpperCase();
    this.disabled = opts.disabled || false;
    this.baseUrl = opts.baseUrl || getBaseUrl({
      isEmbedApp: this.isEmbedApp,
      env: this.env,
      hublet: this.hublet
    });
    this.tags = opts.tags || {};
    this.cookies = opts.cookies || {};
    this.user = opts.user || {};
  }

  _createClass(OutpostErrorReporter, [{
    key: "bindToWindow",
    value: function bindToWindow() {
      var _this = this;

      var allowlistedDomains = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var blocklistedErrorMessages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      if (allowlistedDomains.length < 1) {
        console.warn('You need to specify allowlisted domains when binding to window errors or you will catch all page errors');
        return;
      }

      window.onerror = function (message, url, line, column, error) {
        if (url && contains(allowlistedDomains, url) && !contains(blocklistedErrorMessages, error.message) && message.toLowerCase() !== 'script error') {
          _this.sendReport('error', message, url, error);
        }
      };
    }
  }, {
    key: "report",
    value: function report(error, extraContext) {
      if (error) {
        console.error(error);
        this.sendReport('error', error.message, error.fileName, error, extraContext);
      }
    }
  }, {
    key: "debug",
    value: function debug(error, extraContext) {
      if (error && this.level === 'DEBUG') {
        console.debug(error);
        this.sendReport('debug', error.message, error.fileName, error, extraContext);
      }
    }
  }, {
    key: "addTags",
    value: function addTags(tags) {
      extend(this.tags, tags);
    }
  }, {
    key: "addCookies",
    value: function addCookies(cookies) {
      extend(this.cookies, cookies);
    }
  }, {
    key: "addUserContext",
    value: function addUserContext(context) {
      extend(this.user, context);
    }
  }, {
    key: "sendReport",
    value: function sendReport(level, message, url, error, extraContext) {
      var _this2 = this;

      if (this.disabled) {
        console.warn('Not reporting error to Outpost because logging is disabled');
        return;
      }

      url = url || (window.document.currentScript ? window.document.currentScript.src : null) || window.location.href;
      var report = this.buildReport(level, message, url, error, extraContext);
      var uploadImage = new Image();
      var encodedReport = encodeURIComponent(JSON.stringify(report));
      uploadImage.src = this.baseUrl + "/" + this.projectName + "/error.gif?report=" + encodedReport;

      uploadImage.onload = function () {
        console.log("Completed reporting error to " + _this2.projectName);
      };
    }
  }, {
    key: "buildReport",
    value: function buildReport(level, message, url, error) {
      var extraContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var errorType = error.name || error;
      var trimmedExceptionMessage;

      if (error && error.message) {
        trimmedExceptionMessage = error.message.substring(0, 999);
      } else {
        trimmedExceptionMessage = message.substring(0, 999);
      }

      return {
        culprit: errorType,
        message: trimmedExceptionMessage,
        level: level,
        exception: [{
          type: errorType,
          value: error && error.stack && error.stack.substring(0, 999) || trimmedExceptionMessage,
          url: url
        }],
        request: {
          url: window.location.protocol + "//" + (window.location.host + window.location.pathname),
          queryString: window.location.search.replace(/(^\?)/, ''),
          cookies: stringifyCookies(this.cookies)
        },
        environment: this.env,
        tags: extend(this.tags),
        user: this.user,
        extra: extraContext
      };
    }
  }]);

  return OutpostErrorReporter;
}();

export default OutpostErrorReporter;