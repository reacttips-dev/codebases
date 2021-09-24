'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { NavMarker } from 'react-rhumb';
import { createSetOnboardingStatusMessage, createRefreshCalleeOmnibus } from 'calling-internal-common/iframe-events/internalEventMessageCreators';
import { getIsOnboardingComplete, getIsOnboardingLoading, getIsOnboardingFailed } from 'calling-lifecycle-internal/onboarding/operators/getOnboardingStatuses';
import { OnboardingStatusPropType } from 'calling-lifecycle-internal/onboarding/operators/OnboardingStatusPropType';
import WidgetError from '../../widget-error/components/WidgetError';
import LearnMoreContainer from '../containers/LearnMoreContainer';
import RegisterOrLearn from 'calling-lifecycle-internal/onboarding/components/RegisterOrLearn';
import ClientStatusPropType from 'calling-internal-common/widget-status/prop-types/ClientStatusPropType';
import { AsyncRegisterNumberInverse } from '../../register-number/containers/AsyncRegisterNumberInverse';
import { AsyncRegisterTwilioConnectNumber } from '../../register-number/containers/AsyncRegisterTwilioConnectNumber';
import AppSkeleton from 'calling-lifecycle-internal/skeleton-states/components/AppSkeleton';
import CallWidgetFooterContainer from '../../widget-footer/containers/CallWidgetFooterContainer';
import { HUBSPOT, TWILIO } from 'calling-lifecycle-internal/call-provider/constants/ProviderNames';
import OnboardingResizeWrapper from './OnboardingResizeWrapper';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';

var Onboarding = /*#__PURE__*/function (_PureComponent) {
  _inherits(Onboarding, _PureComponent);

  function Onboarding() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Onboarding);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Onboarding)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleSendOnboardingStatus = function (_ref) {
      var onboardingStatus = _ref.onboardingStatus;
      var message = createSetOnboardingStatusMessage(onboardingStatus);

      _this.props.callExtensions.postMessageToHost(message);
    };

    _this.showLearnMoreFlow = function () {
      _this.props.setShouldShowOnboardingIntro(true);
    };

    _this.showRegisterNumberFlow = function () {
      var _this$props = _this.props,
          isUsingTwilioConnect = _this$props.isUsingTwilioConnect,
          setRegisterFromNumberType = _this$props.setRegisterFromNumberType;
      setRegisterFromNumberType({
        isUsingTwilioConnect: isUsingTwilioConnect
      });
    };

    _this.hideRegisterNumberFlow = function () {
      var _this$props2 = _this.props,
          resetHubSpotRegistration = _this$props2.resetHubSpotRegistration,
          resetTwilioConnectRegistration = _this$props2.resetTwilioConnectRegistration,
          resetOnboardingState = _this$props2.resetOnboardingState,
          subjectId = _this$props2.subjectId,
          objectTypeId = _this$props2.objectTypeId;
      var message = createRefreshCalleeOmnibus({
        subjectId: subjectId,
        objectTypeId: objectTypeId
      });

      _this.props.callExtensions.postMessageToHost(message);

      resetOnboardingState();
      resetHubSpotRegistration();
      resetTwilioConnectRegistration();
    };

    _this.handleRefreshSettings = function () {
      _this.props.getOmnibusSettings({
        subjectId: _this.props.subjectId,
        objectTypeId: _this.props.objectTypeId
      });
    };

    _this.handleRegistrationSuccess = function () {
      _this.hideRegisterNumberFlow();
    };

    return _this;
  }

  _createClass(Onboarding, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.handleSendOnboardingStatus(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var onboardingStatus = this.props.onboardingStatus;

      if (prevProps.onboardingStatus !== onboardingStatus) {
        this.handleSendOnboardingStatus(this.props);
      }
    }
  }, {
    key: "renderOnboardingContents",
    value: function renderOnboardingContents() {
      var _this$props3 = this.props,
          clientStatus = _this$props3.clientStatus,
          isUsingTwilioConnect = _this$props3.isUsingTwilioConnect,
          shouldShowOnboardingIntro = _this$props3.shouldShowOnboardingIntro,
          registerFromNumberType = _this$props3.registerFromNumberType,
          isPaidHub = _this$props3.isPaidHub,
          isSalesEnterpriseTrial = _this$props3.isSalesEnterpriseTrial,
          scopes = _this$props3.scopes,
          userEmail = _this$props3.userEmail,
          initialLoadSettings = _this$props3.initialLoadSettings,
          isUngatedForCountryUnsupportedMessaging = _this$props3.isUngatedForCountryUnsupportedMessaging,
          appIdentifier = _this$props3.appIdentifier,
          userId = _this$props3.userId,
          isUngatedForPhoneNumberAcquisition = _this$props3.isUngatedForPhoneNumberAcquisition;

      if (!shouldShowOnboardingIntro && !registerFromNumberType) {
        return /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx(RegisterOrLearn, {
            onRegisterNumber: this.showRegisterNumberFlow,
            onLearnMore: this.showLearnMoreFlow,
            isUsingTwilioConnect: isUsingTwilioConnect,
            maxWidth: "inherit",
            isUngatedForPhoneNumberAcquisition: isUngatedForPhoneNumberAcquisition
          }), /*#__PURE__*/_jsx(CallWidgetFooterContainer, {
            clientStatus: clientStatus
          })]
        });
      } else if (shouldShowOnboardingIntro) {
        return /*#__PURE__*/_jsx(LearnMoreContainer, {
          showRegisterNumberFlow: this.showRegisterNumberFlow
        });
      } else if (registerFromNumberType === TWILIO) {
        return /*#__PURE__*/_jsx(AsyncRegisterTwilioConnectNumber, {
          isPaidHub: isPaidHub,
          isSalesEnterpriseTrial: isSalesEnterpriseTrial,
          onComplete: this.handleRegistrationSuccess,
          onCancel: this.hideRegisterNumberFlow,
          scopes: scopes,
          userEmail: userEmail,
          userId: userId,
          handleRefreshSettings: this.handleRefreshSettings,
          appIdentifier: appIdentifier
        });
      }

      return /*#__PURE__*/_jsx(AsyncRegisterNumberInverse, {
        initialLoadSettings: initialLoadSettings,
        onComplete: this.handleRegistrationSuccess,
        onCancel: this.hideRegisterNumberFlow,
        isPaidHub: isPaidHub,
        isSalesEnterpriseTrial: isSalesEnterpriseTrial,
        scopes: scopes,
        userEmail: userEmail,
        userId: userId,
        handleRefreshSettings: this.handleRefreshSettings,
        isUngatedForCountryUnsupportedMessaging: isUngatedForCountryUnsupportedMessaging,
        appIdentifier: appIdentifier
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          onboardingStatus = _this$props4.onboardingStatus,
          children = _this$props4.children,
          isThirdPartyProvider = _this$props4.isThirdPartyProvider,
          registerFromNumberType = _this$props4.registerFromNumberType,
          hubSpotCallingEnabled = _this$props4.hubSpotCallingEnabled,
          isUsingTwilioConnect = _this$props4.isUsingTwilioConnect;

      if (getIsOnboardingComplete(onboardingStatus) && !registerFromNumberType || !hubSpotCallingEnabled && !isUsingTwilioConnect) {
        return children;
      }

      if (getIsOnboardingLoading(onboardingStatus)) {
        return /*#__PURE__*/_jsx(AppSkeleton, {
          isThirdPartyProvider: isThirdPartyProvider
        });
      }

      if (getIsOnboardingFailed(onboardingStatus)) {
        return /*#__PURE__*/_jsx(NavMarker, {
          name: "INDEX_LOAD_FAILURE",
          children: /*#__PURE__*/_jsx(WidgetError, {})
        });
      }

      return /*#__PURE__*/_jsx(NavMarker, {
        name: "CALLING_ONBOARDING_LOADED",
        children: /*#__PURE__*/_jsx(OnboardingResizeWrapper, {
          children: this.renderOnboardingContents()
        })
      });
    }
  }]);

  return Onboarding;
}(PureComponent);

Onboarding.propTypes = {
  children: PropTypes.node.isRequired,
  clientStatus: ClientStatusPropType.isRequired,
  onboardingStatus: OnboardingStatusPropType.isRequired,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  resetHubSpotRegistration: PropTypes.func.isRequired,
  resetTwilioConnectRegistration: PropTypes.func.isRequired,
  callExtensions: PropTypes.object.isRequired,
  isThirdPartyProvider: PropTypes.bool.isRequired,
  shouldShowOnboardingIntro: PropTypes.bool.isRequired,
  setShouldShowOnboardingIntro: PropTypes.func.isRequired,
  resetOnboardingState: PropTypes.func.isRequired,
  setRegisterFromNumberType: PropTypes.func.isRequired,
  registerFromNumberType: PropTypes.oneOf([HUBSPOT, TWILIO]),
  isPaidHub: PropTypes.bool.isRequired,
  isSalesEnterpriseTrial: PropTypes.bool.isRequired,
  scopes: PropTypes.arrayOf(PropTypes.string).isRequired,
  userEmail: PropTypes.string.isRequired,
  initialLoadSettings: RecordPropType('InitialLoadSettings').isRequired,
  getOmnibusSettings: PropTypes.func.isRequired,
  subjectId: PropTypes.string,
  objectTypeId: PropTypes.string,
  isUngatedForCountryUnsupportedMessaging: PropTypes.bool,
  appIdentifier: PropTypes.string.isRequired,
  hubSpotCallingEnabled: PropTypes.bool.isRequired,
  isUngatedForPhoneNumberAcquisition: PropTypes.bool,
  userId: PropTypes.number.isRequired
};
export { Onboarding as default };