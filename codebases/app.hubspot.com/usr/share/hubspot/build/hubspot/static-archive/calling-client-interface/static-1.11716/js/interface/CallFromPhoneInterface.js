'use es6';
/**
 * This interface provides controls for calling from phone and only accesses internal endpoints
 *
 * This shares some base functionality with Call from phone which exists in the CallFromInterface.
 * To include this interface in a component use context ./context/CallClientContext.js
 */

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { CALL_FROM_PHONE } from '../constants/CallMethods';
import StandardFriendlyError from 'calling-error-reporting/standard-friendly-error/StandardFriendlyError';
import CallFromInterface from './lib/CallFromInterface';
import * as CallMyPhoneClient from '../clients/CallMyPhoneClient';
import * as CallLogAPI from '../clients/CallLogAPI';
import { HUBSPOT } from '../constants/ProviderNames';
import { READY, INITIALIZING_OUTBOUND_CALL } from '../constants/CallWidgetStates';
import { getCallStatusFromEngagement } from 'calling-client-interface/records/engagement/getters';
import { mark, measure } from '../utils/performance';
import { PHONE_START_CALL_TOTAL } from '../constants/clientPerformanceKeys';
import { INTERNAL_CALLING_CRM_USER } from '../constants/engagementStatuses';

var CallFromPhoneInterface = /*#__PURE__*/function (_CallFromInterface) {
  _inherits(CallFromPhoneInterface, _CallFromInterface);

  function CallFromPhoneInterface(options) {
    var _this;

    _classCallCheck(this, CallFromPhoneInterface);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CallFromPhoneInterface).call(this, options));
    _this.type = CALL_FROM_PHONE;
    _this._pollingTimeout = null;
    _this._status = null;
    _this._measuredStartCallTotal = false;

    _this._setClientStatus(READY);

    return _this;
  }

  _createClass(CallFromPhoneInterface, [{
    key: "_stopPollingCallInProgress",

    /** clears polling that was started by _pollCallEngagementStatus  */
    value: function _stopPollingCallInProgress() {
      clearTimeout(this._pollingTimeout);
      this._pollingTimeout = null;
    }
    /**
     * Creates initital engagement and starts call.
     */

  }, {
    key: "startCall",
    value: function startCall(_ref) {
      var _this2 = this;

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
          ownerId = _ref.ownerId,
          twilioClientOptions = _ref.twilioClientOptions,
          _ref$isUngatedForCall = _ref.isUngatedForCallMyPhoneOmnibus,
          isUngatedForCallMyPhoneOmnibus = _ref$isUngatedForCall === void 0 ? false : _ref$isUngatedForCall,
          threadId = _ref.threadId;
      mark(PHONE_START_CALL_TOTAL);

      this._resetConnection();

      this._setClientStatus(INITIALIZING_OUTBOUND_CALL);

      return CallMyPhoneClient.startCall({
        toNumber: toNumber,
        fromNumber: fromNumber,
        calleeId: calleeId,
        calleeObjectTypeId: calleeObjectTypeId,
        source: source,
        initialIncludeRecording: initialIncludeRecording,
        associations: associations,
        subscriptionOverride: subscriptionOverride,
        accountSid: accountSid,
        accountType: accountType,
        ownerId: ownerId,
        twilioClientOptions: twilioClientOptions,
        isUngatedForCallMyPhoneOmnibus: isUngatedForCallMyPhoneOmnibus,
        threadId: threadId
      }).then(function (response) {
        if (isUngatedForCallMyPhoneOmnibus) {
          if (response['@result'] !== 'OK') {
            throw new StandardFriendlyError(response);
          }

          _this2._callSid = response.callSid;
        } else {
          if (!response.callmyphone || !response.callmyphone.sid) {
            throw new Error('Call From Phone not started with non-omnibus apis');
          }

          _this2._callSid = response.callmyphone.sid;
        }

        _this2._setCallSid(_this2._callSid);

        _this2._measuredStartCallTotal = false;
        _this2._engagementId = response.createCallResponse.callCrmObjectId;

        _this2._setEngagementData(response.createCallResponse);

        _this2._pollCallEngagementStatus();
      }).catch(function (error) {
        // rethrow error to handle widget reset.
        error.isCallMyPhone = true;

        _this2._logError({
          error: error,
          errorMessage: 'Error starting a call',
          extraData: {
            toNumber: toNumber,
            fromNumber: fromNumber,
            calleeId: calleeId,
            calleeObjectTypeId: calleeObjectTypeId,
            source: source,
            initialIncludeRecording: initialIncludeRecording,
            associations: associations,
            subscriptionOverride: subscriptionOverride,
            accountSid: accountSid,
            accountType: accountType,
            threadId: threadId
          }
        });

        _this2._resetConnection();

        throw error;
      });
    }
    /**
     * Handles call from phone end
     * Do not call directly use endCall from the parent class
     * @param {Object} options
     * @param {String} options.failReason
     */

  }, {
    key: "_handleEndCall",
    value: function _handleEndCall(options) {
      this._stopPollingCallInProgress();

      return this._endAndSaveCallMyPhone(options);
    }
  }, {
    key: "_retryPollCallEngagementStatus",
    value: function _retryPollCallEngagementStatus(failedAttempts) {
      var _this3 = this;

      return new Promise(function (resolve) {
        _this3._pollingTimeout = window.setTimeout(function () {
          return resolve(_this3._pollCallEngagementStatus(failedAttempts));
        }, 1000);
      });
    }
    /**
     * While a phone call is progress this polling loop detects weather or not
     * the call was hungup by the user or agent by checking the status of the engagement.
     */

  }, {
    key: "_pollCallEngagementStatus",
    value: function _pollCallEngagementStatus() {
      var _this4 = this;

      var failedAttempts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this._stopPollingCallInProgress();

      return CallLogAPI.fetchEngagementCallStatusProperties(this._engagementId).then(function (engagement) {
        var callStatus = getCallStatusFromEngagement(engagement);

        var appStatus = _this4._reconcileEngagementStatusWithClientStatus(callStatus);

        var isCallInProgress = _this4._isCallInProgressByAppStatus(appStatus);

        if (_this4._status !== callStatus) {
          _this4._setClientStatus(appStatus);
        }

        if (!appStatus || isCallInProgress) {
          if (_this4._status === INTERNAL_CALLING_CRM_USER && !_this4._measuredStartCallTotal) {
            measure({
              name: PHONE_START_CALL_TOTAL,
              providerName: HUBSPOT
            });
            _this4._measuredStartCallTotal = true;
          }

          _this4._status = callStatus;
          return _this4._retryPollCallEngagementStatus();
        }

        return _this4._endAndSaveCallMyPhone({
          failReason: '_pollCallEngagementStatus'
        });
      }).catch(function (error) {
        // retry before failing incase of internet loss.
        if (failedAttempts < 5) {
          failedAttempts += 1;
          return _this4._retryPollCallEngagementStatus(failedAttempts);
        } // TODO: Critical failure - we should prompt the user.


        _this4._logError({
          error: error,
          errorMessage: 'Polling call engagement status failed'
        });

        return null;
      });
    }
    /**
     * Ends call and initiates _pollCallEndEngagement on the parent class
     * until engagement responds with a call status of ended or failed
     * @param {Object} param0
     * @param {String} param0.failReason
     */

  }, {
    key: "_endAndSaveCallMyPhone",
    value: function _endAndSaveCallMyPhone(_ref2) {
      var _this5 = this;

      var failReason = _ref2.failReason;
      return CallMyPhoneClient.endCall({
        engagementId: this._engagementId,
        callSid: this._callSid
      }).then(function () {
        return _this5._pollCallEndEngagement();
      }).catch(function (error) {
        _this5._logError({
          errorMessage: 'end call failed',
          extraData: {
            error: error,
            failReason: failReason
          }
        });
      });
    }
  }]);

  return CallFromPhoneInterface;
}(CallFromInterface);

export { CallFromPhoneInterface as default };