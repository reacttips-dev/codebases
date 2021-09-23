'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import httpRetryClient from '../../api/retryClient';
import CryptUtil from '../../util/CryptUtil';
import { debug } from '../../util/DebugUtil';
import { ABLY_URL, CONNECTED_EVENT, NOTIFICATION_EVENT } from './AblyConstants';
import { debugListener, getReceivedNotificationListener } from './RealtimeListeners';
import { buildRealtimeClient } from './buildRealtimerClient';
var maxTime = 150000;

var AblyManager = /*#__PURE__*/function () {
  function AblyManager() {
    var _this = this;

    _classCallCheck(this, AblyManager);

    this.timer = 15000;

    this.ablyCallback = function (params, callback) {
      return AblyManager.fetchToken().then(function (_ref) {
        var token = _ref.token;
        callback(null, token);
      }).catch(function (error) {
        callback(error);

        _this.client.close();

        var timeout = Math.min(_this.timer, maxTime);
        _this.timer = _this.timer + 5000;
        setTimeout(function () {
          _this.client.connect();
        }, timeout);
      });
    };
  }

  _createClass(AblyManager, [{
    key: "onDecryptFailure",
    value: function onDecryptFailure(notification) {
      var _this2 = this;

      if (this.failureCount > 3) {
        this.failureCount = 0;

        var _CryptUtil$splitEncry = CryptUtil.splitEncryptedToken(notification),
            timestamp = _CryptUtil$splitEncry.timestamp;

        throw new Error("Not matching timestamp found for: " + timestamp);
      }

      this.failureCount++;
      AblyManager.fetchToken().then(this.setupListeners).then(function () {
        _this2.receivedListener({
          data: notification
        });
      }).catch(function (error) {
        debug(error);
      });
    }
  }, {
    key: "getChannel",
    value: function getChannel() {
      var channelName = Object.keys(JSON.parse(this.client.auth.tokenDetails.capability))[0];
      var channel = this.client.channels.get(channelName);
      return {
        channel: channel,
        channelName: channelName
      };
    }
  }, {
    key: "setup",
    value: function setup() {
      var _this3 = this;

      this.failureCount = 0;
      this.onDecryptFailure = this.onDecryptFailure.bind(this);
      this.setupListeners = this.setupListeners.bind(this);
      this.client = buildRealtimeClient({
        authCallback: this.ablyCallback
      });
      this.client.connection.on(CONNECTED_EVENT, function () {
        debug('CONNECTED TO ABLY');
        AblyManager.fetchToken().then(_this3.setupListeners).catch(function (error) {
          debug(error);
        });
      });
    }
  }, {
    key: "setupListeners",
    value: function setupListeners(_ref2) {
      var ablyKey = _ref2.ablyKey;

      var _this$getChannel = this.getChannel(),
          channel = _this$getChannel.channel,
          channelName = _this$getChannel.channelName;

      channel.unsubscribe(NOTIFICATION_EVENT, debugListener);
      channel.unsubscribe(NOTIFICATION_EVENT, this.receivedListener);
      debug('SUBSCRIBING TO ABLY CHANNEL: ', channelName);
      debug('USING ablyKey', ablyKey);
      this.receivedListener = getReceivedNotificationListener(ablyKey, this.onDecryptFailure);

      try {
        channel.subscribe(NOTIFICATION_EVENT, debugListener);
        channel.subscribe(NOTIFICATION_EVENT, this.receivedListener);
      } catch (error) {
        debug('COULD NOT SUBSCRIBE TO ABLY:', error);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (this.client) {
        this.client.close();
      }
    }
  }], [{
    key: "fetchToken",
    value: function fetchToken() {
      return httpRetryClient.get(ABLY_URL).then(function (_ref3) {
        var ablyKey = _ref3.ablyKey,
            tokenRequest = _ref3.tokenRequest;
        return {
          ablyKey: ablyKey,
          token: tokenRequest
        };
      });
    }
  }]);

  return AblyManager;
}();

export default new AblyManager();