'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import get from 'transmute/get';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { CallClientContextProvider } from 'calling-client-interface/context/CallClientContext';
import { createInterfaceByType } from 'calling-client-interface/operators/createInterfaceByType';
import { createSwitchToThirdPartyMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import * as CallWidgetStates from 'calling-internal-common/widget-status/constants/CallWidgetStates';
import { logCallingError, logPageAction } from 'calling-error-reporting/report/error';
import { getToken } from 'calling-client-interface/records/token/getters';
import { getCallStatusFromEngagement, getDurationFromEngagement } from 'calling-client-interface/records/engagement/getters';
import { getCallableObject } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { callingNewRelicHelper, NEW_RELIC_CALL_STATUS } from '../../monitoring/callingNewRelicHelpers';
import CallingExtensionsContext from '../context/CallingExtensionsContext';
import { getSelectedFromNumber, getSelectedConnectFromNumber, getOwnerId, getSubjectId, getObjectTypeId } from '../../active-call-settings/records/getters';
import { isClientReady, isClientRinging, isClientEnding, isClientEnded, isClientAnswered, isClientLoading } from 'calling-internal-common/widget-status/operators/getClientState';
import * as internalEventTypes from 'calling-internal-common/iframe-events/InternalIframeEventTypes';
import { createDialNumberPayload } from 'calling-lifecycle-internal/utils/createDialNumberPayload';
import { getIsOnboardingComplete } from 'calling-lifecycle-internal/onboarding/operators/getOnboardingStatuses';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getDefaultAssociationsWithCallee } from '../../associations/utils/getDefaultAssociationsWithCallee';
import { getStartCallRequestArguments } from '../../active-call-settings/operators/getStartCallRequestArguments';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { OnboardingStatusPropType } from 'calling-lifecycle-internal/onboarding/operators/OnboardingStatusPropType';
import { isFailed, isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { Subject } from '../../active-call-settings/records/ActiveCallSettings';
import { getMetadata, getAdditionalProperties } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { getFormattedName } from '../../callee-properties/operators/propertyValueGetters';
import * as PageActionKeys from '../../constants/pageActionKeys';
import { messageConstants } from 'calling-settings-ui-library/number-registration/utils/InvalidPhoneNumberMessage';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import getStartCallFailedReasonMessage from '../operators/getStartCallFailedReasonMessage';

var CallingClient = /*#__PURE__*/function (_PureComponent) {
  _inherits(CallingClient, _PureComponent);

  function CallingClient() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CallingClient);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CallingClient)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.callClient = {};
    _this.startCallLatency = 0;
    _this.startCallTime = 0;
    _this.startCallPending = false;
    _this.mediaStream = null;

    _this.handleExtensionsEvent = function (message) {
      var _this$props = _this.props,
          fetchCallees = _this$props.fetchCallees,
          fetchCalleeIfNeeded = _this$props.fetchCalleeIfNeeded,
          setToNumberIdentifier = _this$props.setToNumberIdentifier,
          clearCalleesSearch = _this$props.clearCalleesSearch,
          clearCallees = _this$props.clearCallees,
          onboardingStatus = _this$props.onboardingStatus,
          clientStatus = _this$props.clientStatus,
          resetCallData = _this$props.resetCallData,
          setSubject = _this$props.setSubject,
          setIsQueueTask = _this$props.setIsQueueTask,
          subjectIdFromState = _this$props.subjectId,
          objectTypeIdFromState = _this$props.objectTypeId;
      var type = message.type;
      var onboardingStatusComplete = getIsOnboardingComplete(onboardingStatus);

      switch (type) {
        case internalEventTypes.START_CALL_HOST_MSG:
          {
            // Users can only start calls from two states ended and ready.
            if (!isClientReady(clientStatus) && !isClientEnded(clientStatus) || !onboardingStatusComplete) {
              return;
            }

            var _message$data = message.data,
                data = _message$data === void 0 ? {} : _message$data;
            var calleeInfo = data.calleeInfo,
                toPhoneNumberSrc = data.toPhoneNumberSrc;
            var objectId = parseInt(calleeInfo.calleeId, 10) || null;
            var objectTypeId = calleeInfo.calleeObjectTypeId;

            if (objectTypeId && objectId && toPhoneNumberSrc) {
              var toNumberIdentifier = new PhoneNumberIdentifier({
                objectTypeId: objectTypeId,
                objectId: objectId,
                propertyName: toPhoneNumberSrc
              });
              _this.startCallTime = data.startCallTime;
              clearCalleesSearch();
              setToNumberIdentifier({
                toNumberIdentifier: toNumberIdentifier
              });
              fetchCalleeIfNeeded({
                objectTypeId: objectTypeId,
                objectId: objectId
              });
            }

            if (_this.props.validationErrorMessage && _this.props.validationErrorMessage !== messageConstants.CALL_ID_INVALID) {
              return;
            }

            if (isClientEnded(clientStatus)) {
              resetCallData();
            }

            _this.callClient.initiateStartCall();

            break;
          }

        case internalEventTypes.SELECT_TO_NUMBER_HOST_MSG:
          {
            var _data = message.data;
            var isCallEnded = isClientEnded(clientStatus);

            if (isCallEnded && onboardingStatusComplete) {
              resetCallData();
            }

            if (isClientReady(clientStatus) || isCallEnded) {
              var toSubject = _data.toSubject;

              var _toNumberIdentifier = new PhoneNumberIdentifier({
                objectTypeId: toSubject.objectTypeId,
                // The CRM passes IDs around as strings most of the time.
                // However, these IDs are guaranteed to be numbers and we treat
                // them as such in the communicator UI
                objectId: parseInt(toSubject.objectId, 10) || null,
                propertyName: toSubject.numberPropertyName
              });

              clearCalleesSearch();
              setToNumberIdentifier({
                toNumberIdentifier: _toNumberIdentifier
              });
              fetchCalleeIfNeeded({
                objectTypeId: toSubject.objectTypeId,
                objectId: toSubject.objectId
              });
            }

            break;
          }

        case internalEventTypes.UPDATE_READY_STATE_HOST_MSG:
          {
            var _data2 = message.data;
            var _toSubject = _data2.toSubject;
            var hasSubjectChanged = _toSubject.objectId !== subjectIdFromState || _toSubject.objectTypeId !== objectTypeIdFromState;
            var isClientReadyOrLoading = isClientReady(clientStatus) || isClientLoading(clientStatus); // Navigating to new page we should clear the callees store (since we simply render all its data)

            if (hasSubjectChanged && isClientReadyOrLoading) {
              setSubject(Subject({
                subjectId: _toSubject.objectId,
                objectTypeId: _toSubject.objectTypeId
              }));
              clearCallees();
              clearCalleesSearch();
              fetchCallees({
                objectId: _toSubject.objectId,
                objectTypeId: _toSubject.objectTypeId
              });
            }

            break;
          }

        case internalEventTypes.SET_IS_QUEUE_TASK_HOST_MSG:
          {
            var _data3 = message.data;
            var isQueueTask = _data3.isQueueTask;
            setIsQueueTask({
              isQueueTask: isQueueTask
            });
            break;
          }

        default:
          break;
      }
    };

    _this.shouldCreateClient = function () {
      return !_this.callClient || _this.props.selectedCallMethod !== _this.callClient.type || _this.props.isUsingTwilioConnect !== _this.callClient.isUsingTwilioConnect;
    };

    _this.setupCallClient = function () {
      var isTwilioBasedCalling = getIsTwilioBasedCallProvider(_this.props.selectedCallProvider);

      if (!isTwilioBasedCalling) {
        _this.callClient = {};
      } else {
        var shouldCreateClient = _this.shouldCreateClient();

        if (shouldCreateClient) {
          var Interface = createInterfaceByType(_this.props.selectedCallMethod);

          if (Interface) {
            if (_this.callClient && _this.callClient.destroyTwilioDevice) {
              _this.callClient.destroyTwilioDevice();
            }

            _this.props.setClientStatus(CallWidgetStates.LOADING);

            _this.callClient = new Interface({
              setClientStatus: _this.handleClientStatusChange,
              setEngagementData: _this.props.setEngagementData,
              setCallSid: _this.props.setCallSid,
              setEndCallData: _this.handleSetEndCallData,
              isUsingTwilioConnect: _this.props.isUsingTwilioConnect,
              userId: _this.props.userId,
              logger: CommunicatorLogger,
              portalId: _this.props.portalId,
              setAvailableInputDevices: _this.props.setAvailableInputDevices,
              setAvailableOutputDevices: _this.props.setAvailableOutputDevices,
              setOutputDeviceNotSupported: _this.props.setOutputDeviceNotSupported,
              setInputDeviceNotSupported: _this.props.setInputDeviceNotSupported,
              setInputDevice: _this.props.setInputDevice,
              setOutputDevice: _this.props.setOutputDevice,
              setMosScore: _this.props.setMosScore,
              setDeviceError: _this.props.setDeviceError,
              appIdentifier: _this.props.appIdentifier
            });
          }
        }
      }
    };

    _this.handleSetEndCallData = function (endCallData) {
      var setEndCallData = _this.props.setEndCallData;
      logPageAction({
        key: PageActionKeys.END_CALL,
        tags: {
          method: _this.callClient && _this.callClient.type
        }
      });
      setEndCallData(endCallData); // removes recording circle from browser tab if one was added

      if (_this.mediaStream && typeof _this.mediaStream.getTracks === 'function') {
        _this.mediaStream.getTracks().forEach(function (track) {
          return track.stop();
        });
      }

      _this.mediaStream = null;
      callingNewRelicHelper.setCallStatusAttribute(NEW_RELIC_CALL_STATUS.ENDED);
    };

    _this.handleClientStatusChange = function (clientStatus) {
      var setClientStatus = _this.props.setClientStatus;
      setClientStatus(clientStatus);

      switch (clientStatus) {
        case CallWidgetStates.READY:
          {
            callingNewRelicHelper.setCallStatusAttribute(NEW_RELIC_CALL_STATUS.READY);
            break;
          }

        case CallWidgetStates.RINGING:
          {
            callingNewRelicHelper.setCallStatusAttribute(NEW_RELIC_CALL_STATUS.RINGING);
            break;
          }

        case CallWidgetStates.ANSWERED:
          {
            callingNewRelicHelper.setCallStatusAttribute(NEW_RELIC_CALL_STATUS.CONNECTED);
            break;
          }

        case CallWidgetStates.ENDING:
          {
            callingNewRelicHelper.setCallStatusAttribute(NEW_RELIC_CALL_STATUS.ENDING);
            break;
          }

        default:
          break;
      }
    };

    _this.handleEndCall = function () {
      var selectedCallProvider = _this.props.selectedCallProvider;
      var isTwilioBasedCalling = getIsTwilioBasedCallProvider(selectedCallProvider);

      if (!isTwilioBasedCalling) {
        return;
      }

      _this.callClient.endCall();
    };

    _this.handleThirdPartyStartCall = function () {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _this$props2 = _this.props,
          activeCallSettings = _this$props2.activeCallSettings,
          portalId = _this$props2.portalId,
          toNumberIdentifier = _this$props2.toNumberIdentifier,
          callees = _this$props2.callees,
          validatedToNumber = _this$props2.validatedToNumber;
      var ownerId = getOwnerId(activeCallSettings);
      var subjectId = getSubjectId(activeCallSettings);
      var objectTypeId = getObjectTypeId(activeCallSettings);
      var selectedToNumberPropertyName = toNumberIdentifier.get('propertyName');
      var callableObject = getCallableObject({
        objectId: toNumberIdentifier.get('objectId'),
        objectTypeId: toNumberIdentifier.get('objectTypeId')
      }, callees);
      var validatedToNumberData = getData(validatedToNumber);
      var dialNumberPayload = createDialNumberPayload({
        selectedCallee: callableObject,
        countryCode: validatedToNumberData.countryCode,
        phoneNumber: validatedToNumberData.toNumberString,
        selectedToNumberPropertyName: selectedToNumberPropertyName,
        subjectId: subjectId,
        objectTypeId: objectTypeId,
        ownerId: ownerId,
        portalId: portalId
      });
      dialNumberPayload.forced = force;
      var message = createSwitchToThirdPartyMessage(dialNumberPayload);

      _this.context.postMessageToHost(message);

      return Promise.resolve();
    };

    _this.getDefaultAssociations = function () {
      var _this$props3 = _this.props,
          uasAssociations = _this$props3.uasAssociations,
          selectedCallableObject = _this$props3.selectedCallableObject;
      return getDefaultAssociationsWithCallee({
        uasAssociations: uasAssociations,
        callableObject: selectedCallableObject
      });
    };

    _this.handleTwilioStartCall = function () {
      var _this$props4 = _this.props,
          token = _this$props4.twilioToken,
          recordCall = _this$props4.recordingEnabled,
          appIdentifier = _this$props4.appIdentifier,
          activeCallSettings = _this$props4.activeCallSettings,
          isUsingTwilioConnect = _this$props4.isUsingTwilioConnect,
          validatedToNumber = _this$props4.validatedToNumber,
          selectedCallMethod = _this$props4.selectedCallMethod,
          setInitialRecordState = _this$props4.setInitialRecordState,
          isGDPRBypassed = _this$props4.isGDPRBypassed,
          selectedFromNumber = _this$props4.selectedFromNumber,
          toNumberIdentifier = _this$props4.toNumberIdentifier,
          selectedCallableObject = _this$props4.selectedCallableObject,
          selectedToNumber = _this$props4.selectedToNumber,
          isUngatedForCallMyPhoneOmnibus = _this$props4.isUngatedForCallMyPhoneOmnibus,
          threadId = _this$props4.threadId;

      var _assertThisInitialize = _assertThisInitialized(_this),
          callClient = _assertThisInitialize.callClient;

      var ownerId = getOwnerId(activeCallSettings);
      var requiresToken = callClient && callClient.type === CALL_FROM_BROWSER && !getToken(token);

      if (!callClient || requiresToken) {
        _this.startCallFailed({
          requiresToken: requiresToken
        });

        return Promise.reject();
      }

      var defaultAssociationsData = _this.getDefaultAssociations();

      var validatedToNumberData = getData(validatedToNumber);
      var callData = getStartCallRequestArguments({
        activeCallSettings: activeCallSettings,
        defaultAssociationsData: defaultAssociationsData,
        isUsingTwilioConnect: isUsingTwilioConnect,
        validatedToNumber: validatedToNumberData,
        callableObject: selectedCallableObject,
        recordCall: recordCall,
        isGDPRBypassed: isGDPRBypassed,
        token: token,
        appIdentifier: appIdentifier,
        ownerId: ownerId,
        isUngatedForCallMyPhoneOmnibus: isUngatedForCallMyPhoneOmnibus,
        threadId: threadId
      }); // accountType is required by our createEngagement API

      if (!callData.accountType) {
        _this.startCallFailed({
          requiresToken: requiresToken
        });

        return Promise.reject();
      }

      setInitialRecordState(callData.initialIncludeRecording);

      var startCallPromise = function startCallPromise(mediaStream) {
        _this.mediaStream = window.MediaStream && mediaStream instanceof MediaStream ? mediaStream : null;
        return callClient.startCall(callData).then(function () {
          var clientStatus = _this.props.clientStatus;

          if (!isClientEnded(clientStatus) && !isClientEnding(clientStatus)) {
            var metadata = selectedToNumber && getMetadata(selectedToNumber);
            var additonalProperties = getAdditionalProperties(selectedCallableObject);

            _this.context.callStarted({
              formattedName: getFormattedName(additonalProperties),
              selectedCallMethod: selectedCallMethod,
              selectedToNumber: toNumberIdentifier.toJS(),
              selectedPhoneNumberMetadata: metadata && metadata.toJS(),
              selectedFromNumber: selectedFromNumber && selectedFromNumber.formatted
            });
          }
        }).catch(function (error) {
          _this.startCallFailed({
            requiresToken: requiresToken,
            error: error
          });

          throw new Error(error);
        });
      };

      if (callClient.type === CALL_FROM_BROWSER && !_this.props.hasMicrophonePermissions) {
        return _this.props.getMicrophoneAccess({
          onSuccess: startCallPromise
        });
      }

      return startCallPromise();
    };

    _this.hasRequiredFields = function () {
      var _this$props5 = _this.props,
          activeCallSettings = _this$props5.activeCallSettings,
          selectedCallProvider = _this$props5.selectedCallProvider,
          selectedToNumber = _this$props5.selectedToNumber,
          clientStatus = _this$props5.clientStatus,
          thirdPartyStatus = _this$props5.thirdPartyStatus,
          appIdentifier = _this$props5.appIdentifier,
          threadId = _this$props5.threadId;
      var isTwilioBasedCalling = getIsTwilioBasedCallProvider(selectedCallProvider);

      if (!activeCallSettings) {
        _this.startCallFailed();

        return false;
      }

      var hasSelectedFromNumber = !isTwilioBasedCalling || (_this.callClient.isUsingTwilioConnect ? Boolean(getSelectedConnectFromNumber(activeCallSettings)) : Boolean(getSelectedFromNumber(activeCallSettings)));
      var hasSelectedToNumber = !!selectedToNumber;
      var isCallReady = isTwilioBasedCalling ? isClientReady(clientStatus) || isClientEnded(clientStatus) : isClientReady(thirdPartyStatus);
      var isMissingRequiredThreadId = appIdentifier === 'inbox' && !threadId;

      if (!hasSelectedFromNumber || !hasSelectedToNumber || !isCallReady || isMissingRequiredThreadId) {
        _this.startCallFailed({
          hasCallingFields: {
            hasSelectedFromNumber: hasSelectedFromNumber,
            hasSelectedToNumber: hasSelectedToNumber,
            isCallReady: isCallReady,
            isMissingRequiredThreadId: isMissingRequiredThreadId
          }
        });

        return false;
      }

      return true;
    };

    _this.trackStartCall = function () {
      var _this$props6 = _this.props,
          selectedCallMethod = _this$props6.selectedCallMethod,
          selectedCallProvider = _this$props6.selectedCallProvider,
          appIdentifier = _this$props6.appIdentifier;
      var callMedium = selectedCallMethod === CALL_FROM_PHONE ? 'phone' : 'browser';
      var provider = get('name', selectedCallProvider);

      if (!_this.startCallTime) {
        _this.startCallTime = new Date().getTime();
      }

      var isTwilioBasedProvider = getIsTwilioBasedCallProvider(selectedCallProvider);

      if (isTwilioBasedProvider) {
        logPageAction({
          key: PageActionKeys.START_CALL,
          tags: {
            method: selectedCallMethod,
            provider: provider
          }
        });
        CommunicatorLogger.log('communicator_callActivation');
        CommunicatorLogger.log('communicator_firstCallActivation', {
          screen: 'first activation'
        });
        CommunicatorLogger.log('callUsage_startCall', {
          action: 'start call',
          callMedium: callMedium,
          provider: provider,
          source: appIdentifier
        });
      }
    };

    _this.handleStartCall = function () {
      var _this$props7 = _this.props,
          selectedCallProvider = _this$props7.selectedCallProvider,
          validatedToNumber = _this$props7.validatedToNumber,
          selectedCallableObject = _this$props7.selectedCallableObject,
          shouldShowGDPRMessage = _this$props7.shouldShowGDPRMessage;

      if (shouldShowGDPRMessage) {
        return;
      }

      if (_this.areRequiredFieldsLoading({
        selectedCallableObject: selectedCallableObject,
        validatedToNumber: validatedToNumber
      })) {
        _this.startCallPending = true;
        return;
      }

      var isTwilioBasedCalling = getIsTwilioBasedCallProvider(selectedCallProvider);

      if (!_this.hasRequiredFields()) {
        return;
      }

      _this.trackStartCall();

      if (!isTwilioBasedCalling) {
        _this.handleThirdPartyStartCall();

        return;
      }

      _this.handleTwilioStartCall();
    };

    _this.forceThirdPartyStartCall = function () {
      _this.handleThirdPartyStartCall(true);
    };

    return _this;
  }

  _createClass(CallingClient, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setupCallClient();
      this.context.addEndCallHandler(this.handleEndCall);
      this.context.addDefaultEventHandler(this.handleExtensionsEvent);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props8 = this.props,
          clientStatus = _this$props8.clientStatus,
          getMinutesUsage = _this$props8.getMinutesUsage,
          engagement = _this$props8.engagement,
          selectedCallProvider = _this$props8.selectedCallProvider,
          appIdentifier = _this$props8.appIdentifier,
          selectedFromNumber = _this$props8.selectedFromNumber,
          setClientStatus = _this$props8.setClientStatus;
      this.setupCallClient();

      if (this.startCallPending) {
        if (this.areRequiredFieldsLoading({
          selectedCallableObject: prevProps.selectedCallableObject,
          validatedToNumber: prevProps.validatedToNumber
        }) && !this.areRequiredFieldsLoading({
          selectedCallableObject: this.props.selectedCallMethod,
          validatedToNumber: this.props.validatedToNumber
        })) {
          this.handleStartCall();
          this.startCallPending = false;
        }
      }

      if (!isClientEnded(prevProps.clientStatus) && isClientEnded(clientStatus)) {
        getMinutesUsage();
        var twilioCallStatus = getCallStatusFromEngagement(engagement);
        var twilioCallDurationMs = getDurationFromEngagement(engagement);
        this.context.callEnded({
          twilioCallStatus: twilioCallStatus,
          twilioCallDurationMs: twilioCallDurationMs
        });
        CommunicatorLogger.log('communicatorInteraction', {
          action: 'end call',
          activity: 'call',
          channel: 'outbound call',
          status: twilioCallStatus && twilioCallStatus.toLowerCase(),
          startCallSla: this.startCallLatency,
          callDuration: twilioCallDurationMs || 0,
          source: appIdentifier
        });
      }

      if (!isClientRinging(prevProps.clientStatus) && isClientRinging(clientStatus)) {
        this.startCallLatency = new Date().getTime() - this.startCallTime;
        this.startCallTime = 0;
        var provider = get('name', selectedCallProvider);
        CommunicatorLogger.log('callingExtensions_startCallTime', {
          action: 'call started',
          source: 'communicator',
          provider_name: provider,
          duration: this.startCallLatency
        });
      }

      if (!isClientAnswered(prevProps.clientStatus) && isClientAnswered(clientStatus)) {
        this.context.callAnswered();
      }

      if (isClientEnded(clientStatus) && (prevProps.selectedCallProvider !== selectedCallProvider || prevProps.selectedFromNumber !== selectedFromNumber)) {
        setClientStatus(CallWidgetStates.READY);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.removeEndCallHandler(this.handleEndCall);
      this.context.removeDefaultEventHandler(this.handleExtensionsEvent);
    }
  }, {
    key: "startCallFailed",
    value: function startCallFailed() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          hasCallingFields = _ref.hasCallingFields,
          requiresToken = _ref.requiresToken,
          error = _ref.error;

      var activeCallSettings = this.props.activeCallSettings;
      var message = getStartCallFailedReasonMessage({
        hasCallingFields: hasCallingFields,
        error: error
      });
      this.context.sendNotification({
        notificationType: 'danger',
        message: message
      });
      logPageAction({
        key: PageActionKeys.START_CALL_FAILED,
        tags: {
          method: this.callClient && this.callClient.type
        }
      });
      logCallingError({
        errorMessage: 'Start call failed',
        extraData: {
          activeCallSettings: activeCallSettings,
          hasCallingFields: hasCallingFields,
          requiresToken: !!requiresToken,
          error: error
        }
      });
    }
  }, {
    key: "areRequiredFieldsLoading",
    value: function areRequiredFieldsLoading(_ref2) {
      var selectedCallableObject = _ref2.selectedCallableObject,
          validatedToNumber = _ref2.validatedToNumber;
      var validatedNumberIsLoading = !isSucceeded(validatedToNumber) && !isFailed(validatedToNumber);
      return validatedNumberIsLoading || !selectedCallableObject;
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var callClient = this.callClient;
      callClient.initiateStartCall = this.handleStartCall;
      callClient.handleEndCall = this.handleEndCall;
      callClient.forceThirdPartyStartCall = this.forceThirdPartyStartCall;
      return /*#__PURE__*/_jsx(CallClientContextProvider, {
        value: callClient,
        children: children
      });
    }
  }]);

  return CallingClient;
}(PureComponent);

CallingClient.propTypes = {
  appIdentifier: PropTypes.string.isRequired,
  activeCallSettings: RecordPropType('ActiveCallSettings').isRequired,
  callees: RecordPropType('CalleesRecord').isRequired,
  engagement: RecordPropType('Engagement').isRequired,
  fetchCallees: PropTypes.func.isRequired,
  clientStatus: ClientStatusPropType.isRequired,
  fetchCalleeIfNeeded: PropTypes.func.isRequired,
  thirdPartyStatus: ClientStatusPropType,
  children: PropTypes.node.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  onboardingStatus: OnboardingStatusPropType.isRequired,
  portalId: PropTypes.number.isRequired,
  setToNumberIdentifier: PropTypes.func.isRequired,
  toNumberIdentifier: RecordPropType('PhoneNumberIdentifier'),
  selectedToNumber: RecordPropType('PhoneNumberProperty'),
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired,
  selectedFromNumber: RecordPropType('RegisteredFromNumber'),
  setClientStatus: PropTypes.func.isRequired,
  setCallSid: PropTypes.func.isRequired,
  setEngagementData: PropTypes.func.isRequired,
  setEndCallData: PropTypes.func.isRequired,
  setAvailableInputDevices: PropTypes.func.isRequired,
  setAvailableOutputDevices: PropTypes.func.isRequired,
  setInputDeviceNotSupported: PropTypes.func.isRequired,
  setOutputDeviceNotSupported: PropTypes.func.isRequired,
  hasMicrophonePermissions: PropTypes.bool.isRequired,
  getMicrophoneAccess: PropTypes.func.isRequired,
  recordingEnabled: PropTypes.bool.isRequired,
  setInputDevice: PropTypes.func.isRequired,
  setOutputDevice: PropTypes.func.isRequired,
  setMosScore: PropTypes.func.isRequired,
  setDeviceError: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  getMinutesUsage: PropTypes.func.isRequired,
  resetCallData: PropTypes.func.isRequired,
  isGDPRBypassed: PropTypes.bool.isRequired,
  validationErrorMessage: PropTypes.string,
  setInitialRecordState: PropTypes.func.isRequired,
  setSubject: PropTypes.func.isRequired,
  twilioToken: RecordPropType('Token'),
  uasAssociations: ImmutablePropTypes.mapContains({
    associations: ImmutablePropTypes.OrderedMap,
    error: PropTypes.any,
    loading: PropTypes.bool
  }),
  shouldShowGDPRMessage: PropTypes.bool.isRequired,
  validatedToNumber: RecordPropType('AsyncData'),
  selectedCallableObject: RecordPropType('CallableObject'),
  clearCalleesSearch: PropTypes.func.isRequired,
  clearCallees: PropTypes.func.isRequired,
  threadId: PropTypes.string,
  setIsQueueTask: PropTypes.func.isRequired,
  isUngatedForCallMyPhoneOmnibus: PropTypes.bool.isRequired,
  subjectId: PropTypes.string,
  objectTypeId: AnyCrmObjectTypePropType
};
CallingClient.contextType = CallingExtensionsContext;
export { CallingClient as default };