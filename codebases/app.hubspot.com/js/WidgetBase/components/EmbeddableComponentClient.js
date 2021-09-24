'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import quickFetch from 'quick-fetch';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { WIDGET_MESSAGE_VERSION } from 'calling-lifecycle-internal/constants/twilioWidgetOptions';
import * as internalEventTypes from 'calling-internal-common/iframe-events/InternalIframeEventTypes';
import * as externalEventTypes from 'calling-extensions-sdk-support/post-message-types/constants/ExternalIframeEventTypes';
import EmbeddedContextPropType from 'ui-addon-iframeable/embed/EmbeddedContextPropType';
import { createConfirmWidgetResetResponse, createCallStartedMessage, createCallAnsweredMessage, createCallEndedMessage, createCallSavedMessage, createSetDefaultAssociationsForThirdPartyResponse } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { PhoneNumberIdentifier } from 'calling-lifecycle-internal/callees/records/PhoneNumberIdentifier';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import { getBodyFromEngagement, getDispositionFromEngagement, getActivityTypeFromEngagement } from 'calling-client-interface/records/engagement/getters';
import plainTextFromHTML from '../../utils/plainTextFromHTML';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { getTitleBarHeight, getDefaultMiniumDimensions } from 'calling-internal-common/widget-status/operators/getCallState';
import { createNotificationMessage, createSetMinimumDimensionsMessage } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { READY } from '../../third-party-calling/constants/ThirdPartyStatus';
import { ADDING } from '../../callees/operators/updatePropertyTypes';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { CallExtensionsContextProvider } from '../context/CallingExtensionsContext';
import { validateToPhoneNumber } from '../../callee-number-validation/actions/numberValidationActions';
import { getIsThirdPartyProvider } from '../operators/getIsThirdPartyProvider';
import CallingProvider from 'calling-lifecycle-internal/call-provider/records/CallingProvider';
import { getIsProviderHubSpot, getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import RegisteredFromNumber from 'calling-lifecycle-internal/records/registered-from-number/RegisteredFromNumber';
import { getDefaultAssociationsWithCallee } from '../../associations/utils/getDefaultAssociationsWithCallee';
import getUpdatedAssociationsFromDefaultAssociations from '../../associations/utils/getUpdatedAssociationsFromDefaultAssociations';
import { getNotificationContent } from '../../associations/utils/getNotificationContent';

var EmbeddableComponentClient = /*#__PURE__*/function (_PureComponent) {
  _inherits(EmbeddableComponentClient, _PureComponent);

  function EmbeddableComponentClient(props, context) {
    var _this$eventHandlers;

    var _this;

    _classCallCheck(this, EmbeddableComponentClient);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EmbeddableComponentClient).call(this, props, context));
    _this.eventHandlers = (_this$eventHandlers = {}, _defineProperty(_this$eventHandlers, externalEventTypes.READY, function (data) {
      return _this.handleThirdPartyReady(data);
    }), _defineProperty(_this$eventHandlers, externalEventTypes.INITIALIZED, function (data) {
      return _this.handleThirdPartyIntialized(data);
    }), _defineProperty(_this$eventHandlers, externalEventTypes.LOGGED_IN, function (data) {
      return _this.handleThirdPartyLogin(data);
    }), _defineProperty(_this$eventHandlers, externalEventTypes.LOGGED_OUT, function (data) {
      return _this.handleThirdPartyLogout(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.END_CALL_HOST_MSG, function () {
      return _this.handleEndCall();
    }), _defineProperty(_this$eventHandlers, internalEventTypes.RESET_WIDGET_HOST_MSG, function () {
      return _this.handleResetWidget();
    }), _defineProperty(_this$eventHandlers, internalEventTypes.UPDATE_CALLEE_NUMBER_MSG, function (data) {
      return _this.handleUpdatedCalleeNumber(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.REMOVE_CALLABLE_ASSOCIATION_MSG, function (data) {
      return _this.handleRemoveCallee(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.ADD_CALLABLE_ASSOCIATION_MSG, function (data) {
      return _this.handleAddCallee(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SELECTED_CALL_PROVIDER_MSG, function (data) {
      return data && _this.props.setSelectedProvider(new CallingProvider(data));
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SELECTED_CALL_PROVIDER_SETTING_MSG, function (data) {
      return _this.handleSetSelectedCallProviderSetting(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SELECTED_CALL_METHOD_MSG, function (data) {
      return data && _this.props.setSelectedCallMethod(data.callMethod);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SET_THREAD_ID_HOST_MSG, function (data) {
      return _this.props.setThreadId("" + data.threadId);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SET_WIDGET_CAPABILITIES_HOST_MSG, function (data) {
      return _this.props.setCapabilities(data.capabilities);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SHOW_SETTINGS_STATE_HOST_MSG, function (data) {
      return _this.handleShowSettingsState(data);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.CONFIRM_WIDGET_RESET_REQUEST_HOST_MSG, function (__data, message) {
      return _this.handleRequestConfirmSave(message);
    }), _defineProperty(_this$eventHandlers, internalEventTypes.SET_DEFAULT_ASSOCIATIONS_THIRD_PARTY_HOST_MSG, function (data, originalMessage) {
      return _this.handleAddDefaultAssociations(data, originalMessage);
    }), _this$eventHandlers);

    _this.handleThirdPartyReady = function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          provider = _ref.provider;

      if (getIsThirdPartyProvider(provider)) _this.props.onThirdPartyStatusChange({
        status: READY
      });
    };

    _this.handleThirdPartyIntialized = function () {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          isLoggedIn = _ref2.isLoggedIn,
          provider = _ref2.provider;

      if (isLoggedIn && getIsThirdPartyProvider(provider)) _this.props.onThirdPartyLogIn();
    };

    _this.handleThirdPartyLogin = function () {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          provider = _ref3.provider;

      if (getIsThirdPartyProvider(provider)) _this.props.onThirdPartyLogIn();
    };

    _this.handleThirdPartyLogout = function () {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          provider = _ref4.provider;

      if (getIsThirdPartyProvider(provider)) _this.props.onThirdPartyLogOut();
    };

    _this.handleRequestConfirmSave = function (message) {
      var engagement = _this.props.engagement;
      var notes = getBodyFromEngagement(engagement) || '';
      var disposition = getDispositionFromEngagement(engagement);
      var activityType = getActivityTypeFromEngagement(engagement);
      var shouldConfirm = Boolean(plainTextFromHTML(notes) || disposition || activityType);
      var replyMessage = createConfirmWidgetResetResponse(shouldConfirm);

      _this._sendReplyMessage({
        originalMessage: message,
        type: replyMessage.type,
        message: replyMessage.data
      });
    };

    _this.handleAddPhoneNumber = function (_ref5) {
      var objectId = _ref5.objectId,
          objectTypeId = _ref5.objectTypeId,
          propertyName = _ref5.propertyName;
      var _this$props = _this.props,
          fetchCalleeIfNeeded = _this$props.fetchCalleeIfNeeded,
          setCalleeToUpdate = _this$props.setCalleeToUpdate;
      setCalleeToUpdate({
        calleeToUpdate: new PhoneNumberIdentifier({
          objectId: objectId,
          objectTypeId: objectTypeId,
          propertyName: propertyName
        }),
        updateType: ADDING
      });
      fetchCalleeIfNeeded({
        objectTypeId: objectTypeId,
        objectId: objectId
      });
    };

    _this.handleShowSettingsState = function () {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          addPhoneNumber = _ref6.addPhoneNumber,
          registerFromNumber = _ref6.registerFromNumber,
          learnMore = _ref6.learnMore,
          toSubject = _ref6.toSubject;

      var _this$props2 = _this.props,
          isUsingTwilioConnect = _this$props2.isUsingTwilioConnect,
          setRegisterFromNumberType = _this$props2.setRegisterFromNumberType,
          setShouldShowOnboardingIntro = _this$props2.setShouldShowOnboardingIntro;

      if (addPhoneNumber && toSubject && toSubject.objectId && toSubject.objectTypeId) {
        _this.handleAddPhoneNumber(toSubject);
      } else if (registerFromNumber) {
        setRegisterFromNumberType({
          isUsingTwilioConnect: isUsingTwilioConnect
        });
      } else if (learnMore) {
        setShouldShowOnboardingIntro(true);
      }
    };

    _this.handleUpdatedCalleeNumber = function (data) {
      var objectTypeId = data.objectTypeId || ObjectTypesToIds[data.objectType];
      var quickFetchName = "callees_" + objectTypeId + "_" + data.objectId; // We need to invalidate the cache in order for number updates to sync from
      // the CRM to the iframe.

      if (quickFetch.getRequestStateByName(quickFetchName)) {
        quickFetch.removeEarlyRequest(quickFetchName);
      }

      var userEmail = _this.props.userEmail;
      validateToPhoneNumber(data.property, data.rawValue).then(function (validatedNumber) {
        _this.props.addPhoneNumberProperty({
          objectId: data.objectId,
          rawValue: data.rawValue,
          property: data.property,
          objectTypeId: objectTypeId,
          userEmail: userEmail,
          validatedNumber: validatedNumber
        });
      });
    };

    _this.handleAddCallee = function (data) {
      var fetchCalleeIfNeeded = _this.props.fetchCalleeIfNeeded;
      fetchCalleeIfNeeded({
        objectId: data.associationObjectId,
        objectTypeId: data.associationObjectTypeId
      });
    };

    _this.handleRemoveCallee = function (data) {
      var disassociateCallee = _this.props.disassociateCallee;
      disassociateCallee({
        associationObjectId: data.associationObjectId,
        associationObjectTypeId: data.associationObjectTypeId
      });
    };

    _this.handleSetSelectedCallProviderSetting = function (data) {
      var _this$props3 = _this.props,
          setSelectedProvider = _this$props3.setSelectedProvider,
          setSelectedFromNumber = _this$props3.setSelectedFromNumber,
          setSelectedConnectFromNumber = _this$props3.setSelectedConnectFromNumber;
      var callingProvider = data.callingProvider,
          fromNumber = data.fromNumber;
      setSelectedProvider(new CallingProvider(callingProvider));

      if (!fromNumber) {
        return;
      }

      if (!getIsProviderHubSpot({
        name: callingProvider.name
      })) {
        setSelectedConnectFromNumber(new RegisteredFromNumber(fromNumber));
      } else {
        setSelectedFromNumber(new RegisteredFromNumber(fromNumber));
      }
    };

    _this.handleReceiveMessageFromHost = function (message) {
      var _message$payload = message.payload,
          type = _message$payload.type,
          data = _message$payload.data;
      var eventHandler = _this.eventHandlers[type];

      if (typeof eventHandler === 'function') {
        eventHandler(data, message);
      }

      _this.handleDefaultEvents(message.payload);
    };

    _this.handleResetWidget = function () {
      var _this$props4 = _this.props,
          resetCallData = _this$props4.resetCallData,
          setDeviceError = _this$props4.setDeviceError;
      resetCallData();
      setDeviceError(null);
    };

    _this._sendMessage = function (message) {
      var type = message.type;

      if (!_this.CallingExtensions.isLoaded) {
        _this._queuedMessages[type] = message;
        return;
      }

      var payload = message.data; // TODO: We should try and remove this.

      if (typeof payload === 'string') {
        payload = {
          data: payload
        };
      }

      _this.props.embeddedContext.sendMessage(type, payload);
    };

    _this._sendReplyMessage = function (_ref7) {
      var originalMessage = _ref7.originalMessage,
          type = _ref7.type,
          message = _ref7.message;
      if (_this.props.embeddedContext) _this.props.embeddedContext.sendReplyMessage(originalMessage, type, message);
    };

    _this.sendCallStartedMessage = function (payload) {
      var message = createCallStartedMessage(payload);

      _this._sendMessage(message);
    };

    _this.sendCallAnsweredMessage = function () {
      var message = createCallAnsweredMessage();

      _this._sendMessage(message);
    };

    _this.sendCallEndedMessage = function (payload) {
      var message = createCallEndedMessage(payload);

      _this._sendMessage(message);
    };

    _this.sendCallSaved = function (payload) {
      var message = createCallSavedMessage(payload);

      _this._sendMessage(message);
    };

    _this.handleInitialized = function () {
      var queuedPostMessageTypes = Object.keys(_this._queuedMessages);

      if (queuedPostMessageTypes.length) {
        queuedPostMessageTypes.forEach(function (type) {
          _this._sendMessage(_this._queuedMessages[type]);
        });
        _this._queuedMessages = {};
      }
    };

    _this._addEndCallHandler = function (handler) {
      _this._additionalEndCallHandlers.push(handler);
    };

    _this._removeEndCallHandler = function (handler) {
      _this._additionalEndCallHandlers = _this._additionalEndCallHandlers.filter(function (endCallHandler) {
        return endCallHandler !== handler;
      });
    };

    _this.handleEndCall = function () {
      _this._additionalEndCallHandlers.forEach(function (handler) {
        handler();
      });
    };

    _this._addDefaultEventHandler = function (handler) {
      _this._additionalDefaultEventHandlers.push(handler);
    };

    _this._removeDefaultEventHandler = function (handler) {
      _this._additionalDefaultEventHandlers = _this._additionalDefaultEventHandlers.filter(function (defaultEventHandler) {
        return defaultEventHandler !== handler;
      });
    };

    _this.handleDefaultEvents = function (event) {
      _this._additionalDefaultEventHandlers.forEach(function (handler) {
        handler(event);
      });
    };

    _this.handleSendNotification = function (_ref8) {
      var titleText = _ref8.titleText,
          message = _ref8.message,
          notificationType = _ref8.notificationType;
      var postMessage = createNotificationMessage({
        titleText: titleText,
        message: message,
        notificationType: notificationType
      });

      _this._sendMessage(postMessage);
    };

    _this.handleUpdateMinimumDimensions = function (_ref9) {
      var identifier = _ref9.identifier,
          height = _ref9.height;
      var _this$props5 = _this.props,
          clientStatus = _this$props5.clientStatus,
          selectedCallProvider = _this$props5.selectedCallProvider;
      var baseDimensions = getDefaultMiniumDimensions(getIsTwilioBasedCallProvider(selectedCallProvider));
      var titleBarHeight = getTitleBarHeight(clientStatus);
      var minHeight = baseDimensions.height + titleBarHeight;
      _this._storedComponentHeights[identifier] = height;
      Object.keys(_this._storedComponentHeights).forEach(function (key) {
        minHeight += _this._storedComponentHeights[key];
      });
      var message = createSetMinimumDimensionsMessage(minHeight);

      _this._sendMessage(message);
    };

    _this.state = {
      readyEvent: null,
      widgetDimensions: {
        width: 0,
        height: 0
      }
    };
    _this.CallingExtensions = {
      updateMinimumDimensions: _this.handleUpdateMinimumDimensions,
      callStarted: _this.sendCallStartedMessage,
      callAnswered: _this.sendCallAnsweredMessage,
      callEnded: _this.sendCallEndedMessage,
      callSaved: _this.sendCallSaved,
      isLoaded: false,
      addEndCallHandler: _this._addEndCallHandler,
      removeEndCallHandler: _this._removeDefaultEventHandler,
      addDefaultEventHandler: _this._addDefaultEventHandler,
      removeDefaultEventHandler: _this._removeDefaultEventHandler,
      postMessageToHost: _this._sendMessage,
      sendReplyMessage: _this._sendReplyMessage,
      sendNotification: _this.handleSendNotification
    };
    _this._storedComponentHeights = {};
    _this._additionalReadyHandlers = [];
    _this._additionalEndCallHandlers = [];
    _this._additionalDefaultEventHandlers = [];
    _this._queuedMessages = {};
    return _this;
  }

  _createClass(EmbeddableComponentClient, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onReady({
        receiveMessage: this.handleReceiveMessageFromHost,
        data: {
          version: WIDGET_MESSAGE_VERSION
        }
      });
      this.CallingExtensions.isLoaded = true;
      this.handleInitialized();
    }
  }, {
    key: "handleAddDefaultAssociations",
    value: function handleAddDefaultAssociations(data, originalMessage) {
      var _this2 = this;

      var _this$props6 = this.props,
          uasAssociations = _this$props6.uasAssociations,
          updateUASAssociations = _this$props6.updateUASAssociations;
      var defaultAssociations = getDefaultAssociationsWithCallee({
        uasAssociations: uasAssociations,
        callableObject: {
          objectId: data.subjectId,
          objectTypeId: data.objectTypeId,
          engagementId: data.engagementId
        }
      });
      var associationsFromContext = uasAssociations.get('associations');
      var updatedAssociations = getUpdatedAssociationsFromDefaultAssociations(defaultAssociations, associationsFromContext);
      updateUASAssociations({
        updatedAssociations: updatedAssociations,
        associationsFromContext: associationsFromContext,
        engagementId: data.engagementId,
        // This is called regardless of success / failure
        handleFailedAssociations: function handleFailedAssociations(_ref10) {
          var response = _ref10.response;

          if (response.createFailures.length) {
            _this2.handleSendFailedAssociationNotification(response.createFailures);
          }

          var replyMessage = createSetDefaultAssociationsForThirdPartyResponse(response);

          _this2._sendReplyMessage({
            originalMessage: originalMessage,
            type: replyMessage.type,
            message: replyMessage.data
          });
        }
      });
    }
  }, {
    key: "handleSendFailedAssociationNotification",
    value: function handleSendFailedAssociationNotification(createFailures) {
      var genericFailures = [];
      var associationLimitFailures = [];
      createFailures.forEach(function (failure) {
        if (failure.failReason === 'ASSOCIATION_LIMIT_EXCEEDED') {
          associationLimitFailures.push(failure);
          return;
        }

        genericFailures.push(failure);
      });

      if (associationLimitFailures.length) {
        this.handleSendNotification(getNotificationContent({
          count: associationLimitFailures.length,
          isLimitMessage: true
        }));
      }

      if (genericFailures.length) {
        this.handleSendNotification(getNotificationContent({
          count: genericFailures.length
        }));
      }
    }
  }, {
    key: "handleSelectedCallProvider",
    value: function handleSelectedCallProvider(data) {
      var selectedCallProvider = this.props.selectedCallProvider;
      CommunicatorLogger.log('communicator_ProviderSwitch', {
        action: 'provider switch',
        activity: 'call',
        channel: 'outbound call',
        switchFrom: selectedCallProvider.get('name'),
        switchTo: data.name
      });
      this.props.setSelectedProvider(data);
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      return /*#__PURE__*/_jsx(CallExtensionsContextProvider, {
        value: this.CallingExtensions,
        children: children
      });
    }
  }]);

  return EmbeddableComponentClient;
}(PureComponent);

EmbeddableComponentClient.propTypes = {
  children: PropTypes.node.isRequired,
  resetCallData: PropTypes.func.isRequired,
  setDeviceError: PropTypes.func.isRequired,
  addPhoneNumberProperty: PropTypes.func.isRequired,
  userEmail: PropTypes.string,
  onReady: PropTypes.func.isRequired,
  embeddedContext: EmbeddedContextPropType,
  onThirdPartyStatusChange: PropTypes.func.isRequired,
  onThirdPartyLogIn: PropTypes.func.isRequired,
  onThirdPartyLogOut: PropTypes.func.isRequired,
  setSelectedProvider: PropTypes.func.isRequired,
  setSelectedFromNumber: PropTypes.func.isRequired,
  setSelectedConnectFromNumber: PropTypes.func.isRequired,
  setThreadId: PropTypes.func.isRequired,
  setCapabilities: PropTypes.func.isRequired,
  setSelectedCallMethod: PropTypes.func.isRequired,
  fetchCalleeIfNeeded: PropTypes.func.isRequired,
  setCalleeToUpdate: PropTypes.func.isRequired,
  setRegisterFromNumberType: PropTypes.func.isRequired,
  setShouldShowOnboardingIntro: PropTypes.func.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  engagement: RecordPropType('Engagement').isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  clientStatus: ClientStatusPropType.isRequired,
  updateUASAssociations: PropTypes.func.isRequired,
  uasAssociations: ImmutablePropTypes.map.isRequired,
  disassociateCallee: PropTypes.func.isRequired
};
export { EmbeddableComponentClient as default };