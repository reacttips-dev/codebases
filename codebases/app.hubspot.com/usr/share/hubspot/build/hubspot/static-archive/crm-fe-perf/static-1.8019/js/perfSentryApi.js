'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import enviro from 'enviro';
import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient'; // copy of sentry's uuid generator
// https://github.com/getsentry/sentry-javascript/blob/a01b4ee7f7ba03167d7424daae2fb2f2206687cb/packages/raven-js/src/utils.js#L261-L301

function uuid4() {
  var crypto = window.crypto || window.msCrypto;

  if (typeof crypto !== undefined && crypto.getRandomValues) {
    // Use window.crypto API if available
    var arr = new Uint16Array(8);
    crypto.getRandomValues(arr); // set 4 in byte 7

    arr[3] = arr[3] & 0xfff | 0x4000; // set 2 most significant bits of byte 9 to '10'

    arr[4] = arr[4] & 0x3fff | 0x8000;

    var pad = function pad(num) {
      var v = num.toString(16);

      while (v.length < 4) {
        v = "0" + v;
      }

      return v;
    };

    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
}

var URL = "https://exceptions.hubspot.com/api/1/store/?sentry_version=7&sentry_client=raven-js%2F3.19.1&sentry_key=81a4395c05630d309484a6758d1da394";

var SentryData = function SentryData(message, extra, tags) {
  var _this = this;

  _classCallCheck(this, SentryData);

  this.toJSON = function () {
    return {
      message: _this.message,
      extra: _this.extra,
      event_id: _this.event_id,
      environment: _this.environment,
      tags: _this.tags,
      project: _this.project,
      platform: _this.platform,
      logger: _this.logger,
      request: _this.request
    };
  };

  this.message = message;
  this.extra = extra;
  this.event_id = uuid4();
  this.environment = enviro.getShort();
  this.tags = Object.assign({
    env: enviro.getShort(),
    portalId: PortalIdParser.get(),
    project: 'crm-frontend-performance-errors',
    level: 'info'
  }, tags);
  this.project = '1';
  this.platform = 'javascript';
  this.logger = 'javascript';
  this.request = {
    headers: {
      'User-Agent': navigator.userAgent
    },
    url: window.location.href
  };
};

export var perfSentryApi = {
  send: function send(message, extra) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$sampleRate = _ref.sampleRate,
        sampleRate = _ref$sampleRate === void 0 ? 0.05 : _ref$sampleRate,
        _ref$tags = _ref.tags,
        tags = _ref$tags === void 0 ? {} : _ref$tags;

    // only fire when deployed, in prod
    if (!enviro.deployed() || enviro.getShort() === 'qa') {
      return;
    } // sample events to avoid overwhelming sentry. default is 5%


    if (Math.random() > sampleRate) {
      return;
    }

    var data = new SentryData(message, extra, tags);
    http.post(URL, {
      data: data.toJSON()
    });
  }
};