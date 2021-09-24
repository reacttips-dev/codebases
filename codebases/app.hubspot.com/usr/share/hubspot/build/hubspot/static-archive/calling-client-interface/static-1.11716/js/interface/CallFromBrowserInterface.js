'use es6';
/**
 * This interface provides controls for calling from browser and directly accesses
 * the twilio-client sdk.
 * https://www.twilio.com/docs/voice/client/javascript/overview
 *
 * This shares some base functionality with Call from phone which exists in the CallFromInterface.
 * To include this interface in a component use context ./context/CallClientContext.js
 *
 */

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Device } from 'twilio-client';
import getIn from 'transmute/getIn';
import { CALL_FROM_BROWSER } from '../constants/CallMethods';
import enviro from 'enviro';
import { READY, INITIALIZING_OUTBOUND_CALL, RINGING, ANSWERED, ENDING, ENDED } from '../constants/CallWidgetStates';
import StandardFriendlyError from 'calling-error-reporting/standard-friendly-error/StandardFriendlyError';
import { getToken, getTimestamp } from '../records/token/getters';
import { logSentryInfo, logPageAction } from 'calling-error-reporting/report/error';
import { refreshBrowserTokenClient } from '../clients/refreshBrowserTokenClient';
import CallFromInterface from './lib/CallFromInterface';
import DeviceError from '../records/device-error/DeviceError';
import * as TwilioStatuses from '../constants/twilioStatuses';
import * as CallLogAPI from '../clients/CallLogAPI';
import { mark, measure } from '../utils/performance';
import { HUBSPOT, TWILIO } from '../constants/ProviderNames';
import { BROWSER_START_CALL_TOTAL, TWILIO_CONNECTION_CREATED } from '../constants/clientPerformanceKeys';
import { DTMF_DIGIT_SENT } from '../constants/pageActionKeys';
var ACCESS_TOKEN_EXPIRED = 20104;
var TRANSPORT_ERROR = 31009;

var CallFromBrowserInterface = /*#__PURE__*/function (_CallFromInterface) {
  _inherits(CallFromBrowserInterface, _CallFromInterface);

  function CallFromBrowserInterface(options) {
    var _this;

    _classCallCheck(this, CallFromBrowserInterface);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CallFromBrowserInterface).call(this, options));
    _this.type = CALL_FROM_BROWSER;
    _this._currentToken = null;
    _this._Device = null;
    _this._Connection = null;
    _this._newTokenIsRequired = false;
    _this._deviceIsSetup = false;
    _this._shouldSetupAudioDevices = true;
    _this._mosScores = [];
    _this._shouldStartCallOnDeviceReady = false;
    _this._connectionParams = null;
    _this._endCallIsPending = false;

    _this._onDeviceError = function () {};

    _this.deviceConfig = {
      debug: true,
      edge: 'roaming',
      codecPreferences: ['opus', 'pcmu'],
      enableRingingState: true,
      fakeLocalDTMF: true
    };

    _this._handleDeviceReady = function () {
      if (_this._connectionParams && _this._shouldStartCallOnDeviceReady) {
        _this._shouldStartCallOnDeviceReady = false;

        _this._initiateCallConnection();
      }
    };

    _this._handleDeviceOffline = function () {
      _this._newTokenIsRequired = true;
    };

    _this._setupAudioDevices = function () {
      // If default key exists, use that. Otherwise use the first available input device found.
      var inputDeviceIdToSet = _this._Device.audio.availableInputDevices.get('default') ? 'default' : _this._Device.audio.availableInputDevices.keys().next().value;
      var outputDeviceIdToSet = _this._Device.audio.availableOutputDevices.get('default') ? 'default' : _this._Device.audio.availableOutputDevices.keys().next().value;

      if (_this._shouldSetupAudioDevices) {
        _this._shouldSetupAudioDevices = false;

        _this._setAvailableInputDevices(_this._Device.audio.availableInputDevices);

        _this._setAvailableOutputDevices(_this._Device.audio.availableOutputDevices);

        _this._Device.audio.on('deviceChange', function () {
          _this._setAvailableInputDevices(_this._Device.audio.availableInputDevices);

          _this._setAvailableOutputDevices(_this._Device.audio.availableOutputDevices);
        });

        _this.setOutputDevice(outputDeviceIdToSet);

        _this.setInputDevice(inputDeviceIdToSet);
      }

      if (_this._shouldSetInputDevice) {
        _this.setInputDevice(inputDeviceIdToSet);
      }
    };

    _this._handleConnectionStatusUpdate = function (connection) {
      var appStatus = _this._reconcileTwilioStatusesWithClientStatus(connection.status());

      var callSid = getIn(['parameters', 'CallSid'], connection);

      _this._setClientStatus(appStatus);

      _this._setupAudioDevices();

      _this._setCallSid(callSid);
    };

    _this._handleConnectionDisconnect = function () {
      _this._Connection = null;

      _this._pollCallEndEngagement();

      _this._logMosScore();

      _this._Device.audio.unsetInputDevice().catch(function (error) {
        _this._logError({
          error: error,
          errorMessage: 'Error removing Twilio client MediaStream connection'
        });
      });
    };

    _this._handleConnectionRinging = function () {
      _this._setClientStatus(RINGING);

      measure({
        name: TWILIO_CONNECTION_CREATED,
        providerName: _this.isUsingTwilioConnect ? TWILIO : HUBSPOT
      });
      measure({
        name: BROWSER_START_CALL_TOTAL,
        provderName: _this.isUsingTwilioConnect ? TWILIO : HUBSPOT
      });
    };

    _this._initiateCallConnection = function () {
      if (_this._endCallIsPending) {
        _this._endCall();

        _this._setClientStatus(ENDED);

        return;
      }

      if (_this._Connection) {
        var errorMessage = 'Attempted to start call when a connection already exists';

        _this._logError({
          errorMessage: errorMessage,
          error: new Error(errorMessage),
          extraData: {
            status: _this._Connection.status()
          }
        });

        return;
      } else if (!_this._connectionParams) {
        var _errorMessage = 'Connection Parameters are not set';

        _this._logError({
          errorMessage: _errorMessage,
          error: new Error(_errorMessage)
        });

        return;
      }

      mark(TWILIO_CONNECTION_CREATED);
      _this._Connection = _this._Device.connect(_this._connectionParams);
      _this._connectionParams = null;

      _this._Connection.on('accept', _this._handleConnectionStatusUpdate);

      _this._Connection.on('ringing', _this._handleConnectionRinging);

      _this._Connection.on('sample', _this._handleRTCSample);
    };

    _this._handleRTCSample = function (rtcSample) {
      if (rtcSample.mos) {
        _this._mosScores.push(rtcSample.mos);

        var totalMosScores = _this._mosScores.length;

        var last3MosScores = _this._mosScores.slice(Math.max(totalMosScores - 3, 0), totalMosScores);

        var averageMosScore = last3MosScores.reduce(function (a, b) {
          return a + b;
        }, 0) / last3MosScores.length;

        _this._setMosScore(averageMosScore);
      }
    };

    _this.startCall = function (_ref) {
      var toNumber = _ref.toNumber,
          fromNumber = _ref.fromNumber,
          calleeId = _ref.calleeId,
          calleeObjectTypeId = _ref.calleeObjectTypeId,
          initialIncludeRecording = _ref.initialIncludeRecording,
          subscriptionOverride = _ref.subscriptionOverride,
          source = _ref.source,
          associations = _ref.associations,
          accountSid = _ref.accountSid,
          accountType = _ref.accountType,
          isCallMyPhone = _ref.isCallMyPhone,
          twilioClientOptions = _ref.twilioClientOptions,
          ownerId = _ref.ownerId,
          threadId = _ref.threadId;
      mark(BROWSER_START_CALL_TOTAL);

      _this._resetConnection();

      _this._setClientStatus(INITIALIZING_OUTBOUND_CALL);

      return CallLogAPI.initiateLog({
        toNumber: toNumber,
        fromNumber: fromNumber,
        calleeId: calleeId,
        calleeObjectTypeId: calleeObjectTypeId,
        initialIncludeRecording: initialIncludeRecording,
        subscriptionOverride: subscriptionOverride,
        source: source,
        associations: associations,
        accountSid: accountSid,
        accountType: accountType,
        isCallMyPhone: isCallMyPhone,
        ownerId: ownerId,
        threadId: threadId
      }).then(function (response) {
        if (response['@result'] !== 'OK') {
          throw new StandardFriendlyError(response);
        }

        _this._engagementId = response.callCrmObjectId;
        _this._callId = response.callId;

        _this._setEngagementData(response);

        return _this._handleStartCall({
          toNumber: toNumber,
          fromNumber: fromNumber,
          twilioClientOptions: twilioClientOptions,
          source: source
        });
      }).catch(function (error) {
        _this._logError({
          error: error,
          errorMessage: 'Error initiating call log',
          extraData: {
            toNumber: toNumber,
            fromNumber: fromNumber,
            calleeId: calleeId,
            calleeObjectTypeId: calleeObjectTypeId,
            initialIncludeRecording: initialIncludeRecording,
            subscriptionOverride: subscriptionOverride,
            source: source,
            associations: associations,
            accountSid: accountSid,
            accountType: accountType,
            isCallMyPhone: isCallMyPhone,
            twilioClientOptions: twilioClientOptions,
            threadId: threadId
          },
          tags: {
            message: error.message,
            status: error.status
          }
        });

        _this._resetConnection();

        throw error;
      });
    };

    _this._setDeviceError = function (deviceError) {
      _this._deviceError = deviceError;

      _this._onDeviceError(deviceError);
    };

    _this._handleDeviceError = function (deviceError) {
      if (deviceError.twilioError && (deviceError.twilioError.code === ACCESS_TOKEN_EXPIRED || deviceError.twilioError.code === TRANSPORT_ERROR)) {
        return;
      }

      var error = {
        code: deviceError.code,
        message: deviceError.message || null
      };
      var errorRecord = new DeviceError(error);

      _this._setDeviceError(errorRecord);
    };

    _this._userId = options.userId;
    _this._portalId = options.portalId;
    _this._Device = new Device();
    _this._setAvailableInputDevices = options.setAvailableInputDevices;
    _this._setAvailableOutputDevices = options.setAvailableOutputDevices;
    _this._setOutputDeviceNotSupported = options.setOutputDeviceNotSupported;
    _this._setInputDeviceNotSupported = options.setInputDeviceNotSupported;
    _this._setMosScore = options.setMosScore;
    _this._setInputDevice = options.setInputDevice;
    _this._setOutputDevice = options.setOutputDevice;
    _this._onDeviceError = options.setDeviceError;
    _this._logger = options.logger;
    _this._appIdentifier = options.appIdentifier;

    _this._setUpDeviceListeners();

    return _this;
  }

  _createClass(CallFromBrowserInterface, [{
    key: "_setUpDeviceListeners",
    value: function _setUpDeviceListeners() {
      this._Device.on('error', this._handleDeviceError);

      this._Device.on('offline', this._handleDeviceOffline);

      this._Device.on('disconnect', this._handleConnectionDisconnect);

      this._Device.on('ready', this._handleDeviceReady);

      this._setClientStatus(READY);
    }
    /**
     * callback for this._Device.setup()
     * This is used after refreshing the token or initially setting up the token
     */

  }, {
    key: "_logMosScore",
    value: function _logMosScore() {
      var averageMosScore = this._mosScores.reduce(function (a, b) {
        return a + b;
      }, 0) / this._mosScores.length;

      if (averageMosScore) {
        this._logger.log('communicatorInteraction', {
          action: 'Network Quality',
          activity: 'call',
          channel: 'outbound call',
          source: this._appIdentifier,
          averageMosScore: "" + averageMosScore.toFixed(1)
        });
      }

      this._mosScores = [];
    }
  }, {
    key: "_setupTwilioDevice",
    value: function _setupTwilioDevice(token) {
      // if token is past 60 secconds old we'll need to refresh it.
      // We can check this with data attached to the token in the store.
      // https://www.twilio.com/docs/voice/client/javascript/device#setup
      // callback is _handleDeviceReady when device is reinitialized.
      this._Device.setup(token, this.deviceConfig);

      this._deviceIsSetup = true;
    }
  }, {
    key: "_reconcileTwilioStatusesWithClientStatus",
    value: function _reconcileTwilioStatusesWithClientStatus(status) {
      if (TwilioStatuses.RINGING_STATUSES.includes(status)) {
        return RINGING;
      } else if (TwilioStatuses.IN_PROGRESS_STATUSES.includes(status)) {
        return ANSWERED;
      } else if (TwilioStatuses.ENDING_STATUSES.includes(status)) {
        return ENDING;
      }

      var errorMessage = 'Unable to reconcile twilio status';

      this._logError({
        error: new Error(errorMessage),
        errorMessage: errorMessage,
        extraData: {
          status: status
        }
      });

      return null;
    }
  }, {
    key: "_endCall",
    value: function _endCall() {
      this._Device.disconnectAll();

      this._endCallIsPending = false;
    }
    /**
     * Uses: https://www.twilio.com/docs/voice/client/javascript/device#disconnect-all
     * Ensures that we close any active connections on end.
     * */

  }, {
    key: "_handleEndCall",
    value: function _handleEndCall() {
      if (this._deviceIsSetup && this._Connection) {
        this._endCall();
      } else {
        this._endCallIsPending = true;
      }
    }
    /**
     * Creates an engagement and starts a call.
     */

  }, {
    key: "_handleStartCall",

    /**
     * Handles start calls.
     */
    value: function _handleStartCall(_ref2) {
      var toNumber = _ref2.toNumber,
          fromNumber = _ref2.fromNumber,
          twilioClientOptions = _ref2.twilioClientOptions,
          source = _ref2.source;
      this._connectionParams = {
        toNumber: toNumber,
        engagementId: this._engagementId,
        portalId: this._portalId,
        userId: this._userId,
        fromNumber: fromNumber,
        recordCall: twilioClientOptions.recordCall,
        source: source
      };

      if (this._callId) {
        this._connectionParams.callId = this._callId;
      }

      var token = this._currentToken || twilioClientOptions.token;
      var tokenTimestamp = getTimestamp(token);
      /**
       * tokens expire after 1 mintue in QA and 24 hours in Prod
       * We set the expiration slightly before these time periods.
       * */

      var tokenExpireTime = enviro.isProd() ? 1000 * 60 * 60 * 23 : 50000;
      var isTokenExpiredBeforeSetup = !this._deviceIsSetup && new Date() - tokenTimestamp >= tokenExpireTime;

      if (isTokenExpiredBeforeSetup || this._newTokenIsRequired) {
        this._refreshBrowserToken(token);

        return;
      } else if (!this._deviceIsSetup) {
        this._shouldStartCallOnDeviceReady = true;

        this._setupTwilioDevice(getToken(token));

        return;
      }

      this._initiateCallConnection();
    }
  }, {
    key: "_refreshBrowserToken",
    value: function _refreshBrowserToken() {
      var _this2 = this;

      return refreshBrowserTokenClient({
        isUsingTwilioConnect: this.isUsingTwilioConnect
      }).then(function (result) {
        _this2._shouldStartCallOnDeviceReady = true;
        _this2._currentToken = result;

        _this2._setupTwilioDevice(getToken(result));
      }).catch(function (error) {
        _this2._logError({
          error: error,
          errorMessage: 'Refresh token failure'
        });

        _this2._setDeviceError(new DeviceError({
          code: 'token'
        }));
      });
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(eventName, callback) {
      if (this._Connection) {
        this._Connection.on(eventName, callback);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventName, callback) {
      if (this._Connection) {
        this._Connection.removeListener(eventName, callback);
      }
    }
  }, {
    key: "setInputDevice",
    value: function setInputDevice(deviceId) {
      var _this3 = this;

      this._setInputDevice(deviceId);

      return this._Device.audio.setInputDevice(deviceId).catch(function (error) {
        var browserNotSupported = error.message && error.message.indexOf('support') > -1;

        if (browserNotSupported) {
          _this3._setInputDeviceNotSupported();
        }

        logSentryInfo({
          error: error,
          errorMessage: 'Set input device error',
          extraData: {
            deviceId: deviceId
          },
          level: 'info'
        });
      });
    }
  }, {
    key: "setOutputDevice",
    value: function setOutputDevice(deviceId) {
      var _this4 = this;

      this._setOutputDevice(deviceId);

      return this._Device.audio.speakerDevices.set(deviceId).catch(function (error) {
        var browserNotSupported = error.message && error.message.indexOf('support') > -1;

        if (browserNotSupported) {
          _this4._setOutputDeviceNotSupported();
        }

        logSentryInfo({
          error: error,
          errorMessage: 'Set output device error',
          extraData: {
            deviceId: deviceId
          },
          level: 'info'
        });
      });
    }
    /**
     * https://www.twilio.com/docs/voice/client/javascript/connection#mute-1
     * toggle mute on or off.
     * @param {Boolean} toggleStatus
     */

  }, {
    key: "mute",
    value: function mute(toggleStatus) {
      return this._Connection && this._Connection.mute(toggleStatus);
    }
    /**
     * https://www.twilio.com/docs/voice/client/javascript/connection#sendDigits
     * @param {Number|String} digits
     */

  }, {
    key: "sendDigits",
    value: function sendDigits(digits, data) {
      logPageAction({
        key: DTMF_DIGIT_SENT,
        tags: data
      });
      return this._Connection && this._Connection.sendDigits(digits);
    }
    /** https://www.twilio.com/docs/voice/client/javascript/device#destroy */

  }, {
    key: "destroyTwilioDevice",
    value: function destroyTwilioDevice() {
      return this._Device.destroy();
    }
    /** https://www.twilio.com/docs/voice/client/javascript/device#status */

  }, {
    key: "getDeviceStatus",
    value: function getDeviceStatus() {
      return this._Device && this._Device.status();
    }
  }]);

  return CallFromBrowserInterface;
}(CallFromInterface);

export { CallFromBrowserInterface as default };