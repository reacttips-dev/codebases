'use es6';
/**
 * Base call interface
 * Contains base functionalities for call from phone and call from browser
 */

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import get from 'transmute/get';
import { logCallingError, logPageAction } from 'calling-error-reporting/report/error';
import { READY, ENDING, RINGING, ANSWERED, ENDED } from '../../constants/CallWidgetStates';
import { INTERNAL_CANCELED, INTERNAL_FAILED, INTERNAL_ENDING } from '../../constants/engagementStatuses';
import * as EngagementStatuses from '../../constants/engagementStatuses';
import { getCode } from '../../operators/deviceErrorOperators';
import * as CallErrorAPI from '../../clients/CallErrorAPI';
import * as CallLogAPI from '../../clients/CallLogAPI';
import DeviceError from '../../records/device-error/DeviceError';
import { getCallStatusFromEngagement, getDurationFromEngagement, getExternalIdFromEngagement } from 'calling-client-interface/records/engagement/getters';
import { CALL_META_PROPERTIES } from '../../records/engagement/Engagement';

var CallFromInterface = /*#__PURE__*/function () {
  function CallFromInterface(options) {
    var _this = this;

    _classCallCheck(this, CallFromInterface);

    this.type = null;
    this._callSid = null;
    this._engagementId = null;
    this._deviceError = null;

    this._getFailedReasonRetry = function (sid) {
      var errorCode = null;
      var errorMessage = null;
      return CallErrorAPI.getFailedCallErrorCode(sid).then(function (notifications) {
        var notification = get(0, notifications);

        if (notification) {
          errorCode = get('errorCode', notification);
          errorMessage = get('messageText', notification) || null;
        }

        return {
          errorCode: errorCode,
          errorMessage: errorMessage
        };
      }).catch(function () {
        return {
          errorCode: errorCode,
          errorMessage: errorMessage
        };
      });
    };

    this._delayRequest = function () {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, time);
      });
    };

    this.endCall = function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          failReason = _ref.failReason;

      _this._handleEndCall({
        failReason: failReason
      });
    };

    this._setClientStatus = options.setClientStatus;
    this._setEngagementData = options.setEngagementData;
    this._setEndCallData = options.setEndCallData;
    this._setDeviceError = options.setDeviceError;
    this._setCallSid = options.setCallSid;
    this.isUsingTwilioConnect = options.isUsingTwilioConnect;
  }

  _createClass(CallFromInterface, [{
    key: "_logError",

    /**
     * logs error to sentry / new relic and adds an alert to the window.
     * @param {Object} param0
     * @param {Error} param0.error
     * @param {Error} param0.errorMessage
     * @param {String} param0.isUsingTwilioConnect
     * @param {String} param0.failReason
     * @param {Object} param0.extraData
     */
    value: function _logError(_ref2) {
      var error = _ref2.error,
          errorMessage = _ref2.errorMessage,
          isUsingTwilioConnect = _ref2.isUsingTwilioConnect,
          failReason = _ref2.failReason,
          _ref2$extraData = _ref2.extraData,
          extraData = _ref2$extraData === void 0 ? {} : _ref2$extraData,
          _ref2$tags = _ref2.tags,
          tags = _ref2$tags === void 0 ? {} : _ref2$tags;
      logCallingError({
        errorMessage: this.type + " Interface - " + errorMessage,
        extraData: Object.assign({
          error: error,
          engagementId: this._engagementId,
          isUsingTwilioConnect: isUsingTwilioConnect,
          failReason: failReason
        }, extraData),
        tags: tags
      });
    }
  }, {
    key: "_logCallFailedReason",
    value: function _logCallFailedReason(_ref3) {
      var code = _ref3.code,
          attempt = _ref3.attempt;
      logPageAction({
        key: 'CALL_FAILED_REASON',
        tags: {
          code: code,
          attempt: attempt
        }
      });
    }
  }, {
    key: "_logCallFailed",
    value: function _logCallFailed() {
      var endStatusUnavailable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      logPageAction({
        key: 'CALL_FAILED',
        tags: {
          endStatusUnavailable: endStatusUnavailable
        }
      });
    }
  }, {
    key: "_isCallInProgressByAppStatus",
    value: function _isCallInProgressByAppStatus(status) {
      return [ANSWERED, RINGING].includes(status);
    }
  }, {
    key: "_reconcileEngagementStatusWithClientStatus",
    value: function _reconcileEngagementStatusWithClientStatus(status) {
      if (EngagementStatuses.RINGING_STATUSES.includes(status)) {
        return RINGING;
      } else if (EngagementStatuses.IN_PROGRESS_STATUSES.includes(status)) {
        return ANSWERED;
      } else if (EngagementStatuses.ENDING_STATUSES.includes(status)) {
        return ENDING;
      } else if (EngagementStatuses.END_STATUSES.includes(status)) {
        return ENDED;
      }

      this._logError({
        errorMessage: 'unable to determine call status from engagement',
        error: new Error('unable to determine call status from engagement'),
        extraData: {
          engagementId: this._engagementId,
          callSid: this._callSid,
          status: status
        }
      });

      return null;
    }
  }, {
    key: "_getShouldContinuePollingForCallEnded",
    value: function _getShouldContinuePollingForCallEnded(numAttempts, callStatus) {
      var appStatus = this._reconcileEngagementStatusWithClientStatus(callStatus);

      return numAttempts < 20 && (appStatus === ENDING || this._isCallInProgressByAppStatus(appStatus));
    }
  }, {
    key: "_stopPollCallEndEngagement",
    value: function _stopPollCallEndEngagement() {
      clearTimeout(this._retryPollCallEndEngagementTimeout);
      this._retryPollCallEndEngagementTimeout = null;
    }
  }, {
    key: "_retryPollCallEndEngagement",
    value: function _retryPollCallEndEngagement(numAttempts) {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2._retryPollCallEndEngagementTimeout = window.setTimeout(function () {
          return resolve(_this2._pollCallEndEngagement(numAttempts + 1));
        }, 500);
      });
    }
    /**
     * Polls end engagement on a loop till engagement confirms
     * a non call-in-progress status.
     * see:
     * CallFromBrowserInterface#_handleConnectionStatusUpdate,
     * CallFromPhoneInterface#_endAndSaveCallMyPhone
     *
     * @param {Number} numAttempts
     */

  }, {
    key: "_pollCallEndEngagement",
    value: function _pollCallEndEngagement() {
      var _this3 = this;

      var numAttempts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this._stopPollingCallInProgress) this._stopPollingCallInProgress();

      if (numAttempts === 0) {
        this._setClientStatus(ENDING);
      }

      this._stopPollCallEndEngagement();

      return CallLogAPI.fetchEngagementCallStatusProperties(this._engagementId).then(function (engagement) {
        var endStatus = getCallStatusFromEngagement(engagement);

        if (_this3._getShouldContinuePollingForCallEnded(numAttempts, endStatus)) {
          return _this3._retryPollCallEndEngagement(numAttempts);
        }

        return _this3._handleEndCallSuccess({
          engagement: engagement
        });
      }).catch(function (error) {
        // catch misses and keep retrying till attempts are complete.
        if (_this3._getShouldContinuePollingForCallEnded(numAttempts, INTERNAL_ENDING)) {
          return _this3._retryPollCallEndEngagement(numAttempts);
        } // TODO: Critical failure - we should do a connection check and prompt the user.


        _this3._logCallFailed(true);

        _this3._logError({
          error: error,
          errorMessage: 'Polling for engagement data failed.',
          extraData: {
            numAttempts: numAttempts
          }
        });

        return null;
      });
    }
    /**
     * Prior to polling for a call end state we update the engagement for saving.
     * @param {Object} param0
     * @param {Engagement} param0.engagement
     */

  }, {
    key: "_handleEndCallSuccess",
    value: function _handleEndCallSuccess(_ref4) {
      var engagement = _ref4.engagement;
      var engagementStatus = getCallStatusFromEngagement(engagement);
      var callDuration = getDurationFromEngagement(engagement); // callSid is the same as externalId

      var callSid = getExternalIdFromEngagement(engagement);

      if (!callDuration) {
        engagement.properties = engagement.properties || {};
        engagement.properties[CALL_META_PROPERTIES.durationMilliseconds] = {
          value: 0
        };
      }

      if (!callSid) {
        engagementStatus = INTERNAL_CANCELED;
      }

      if (engagementStatus === INTERNAL_FAILED || this._deviceError) {
        this._logCallFailed();

        if (!this._deviceError) {
          this._getFailedReason(callSid);
        } else {
          this._logCallFailedReason({
            code: getCode(this._deviceError),
            attempt: null
          });
        }
      }

      this._setEndCallData({
        engagement: engagement,
        updatedStatus: ENDED,
        callEndStatus: engagementStatus
      });
    }
  }, {
    key: "_resetConnection",
    value: function _resetConnection() {
      this._setClientStatus(READY);

      this._engagementId = null;
      this._callSid = null;
      this._deviceError = null;
    }
  }, {
    key: "_getFailedReason",
    value: function _getFailedReason(sid) {
      var _this4 = this;

      var attempt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (attempt === 0) {
        this._setDeviceError(new DeviceError({
          code: 'unknown'
        }));
      }

      return this._getFailedReasonRetry(sid).then(function () {
        var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var nextAttempt = attempt + 1;

        if (result.errorCode) {
          var code = result.errorCode || 'unknown';
          var message = result.errorMessage;
          var deviceError = new DeviceError({
            code: code,
            message: message
          });

          _this4._logCallFailedReason({
            code: code,
            attempt: attempt
          });

          return _this4._setDeviceError(deviceError);
        } else if (nextAttempt > 9) {
          throw new Error('Max attempts reached');
        }

        return _this4._delayRequest().then(function () {
          return _this4._getFailedReason(sid, nextAttempt);
        });
      }).catch(function (error) {
        _this4._logError({
          errorMessage: 'Unable to retrieve call failed reason',
          error: error,
          extraData: {
            error: error,
            engagementId: _this4._engagementId,
            callSid: _this4._callSid
          },
          tags: {
            message: error.message
          }
        });
      });
    }
    /**
     * CallFromBrowserClient & CallFromPhoneClient both use the same base end call actions
     * The respective differences can be found in _handleEndCall in those classes.
     * @param {Object} param0
     * @param {String} param0.failReason
     */

  }]);

  return CallFromInterface;
}();

export { CallFromInterface as default };