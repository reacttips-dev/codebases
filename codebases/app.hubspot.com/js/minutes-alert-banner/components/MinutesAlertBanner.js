'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import PortalIdParser from 'PortalIdParser';
import { CALYPSO_LIGHT } from 'HubStyleTokens/colors';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getLangLocale from 'I18n/utils/getLangLocale';
import UILink from 'UIComponents/link/UILink';
import { TWILIO } from 'calling-lifecycle-internal/call-provider/constants/ProviderNames';
import { getIsTwilioBasedCallProvider } from 'calling-lifecycle-internal/call-provider/operators/getIsTwilioBasedCallProvider';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import { getTwilioCallingProvider } from 'calling-lifecycle-internal/call-provider/operators/callProviderOperators';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import AsyncCallingUsageUpgradeBanner from './AsyncCallingUsageUpgradeBanner';
import { isSalesPro, isCallingFree, isNearWarningLimit } from 'calling-settings-ui-library/utils/CallingSalesPro';
import { callingUserPreferencesUrl } from 'calling-settings-ui-library/utils/urlUtils';
var USING_HUBSPOT = 'callingMinutesUsage.usingHubspot';
var USING_TWILIO = 'callingMinutesUsage.usingTwilio';

var MinutesAlertBanner = /*#__PURE__*/function (_PureComponent) {
  _inherits(MinutesAlertBanner, _PureComponent);

  function MinutesAlertBanner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, MinutesAlertBanner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(MinutesAlertBanner)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      showConnectBanner: true
    };

    _this.handleCloseTwilioConnectBanner = function () {
      _this.setState({
        showConnectBanner: false
      });
    };

    _this.handleUpdateCallProvider = function () {
      _this.props.setSelectedProvider(getTwilioCallingProvider());
    };

    return _this;
  }

  _createClass(MinutesAlertBanner, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.selectedCallProvider && this.props.selectedCallProvider !== prevProps.selectedCallProvider) this.setState({
        showConnectBanner: true
      });
    }
  }, {
    key: "isEligibleForTwilioConnect",
    value: function isEligibleForTwilioConnect() {
      var scopes = this.props.scopes;
      return isSalesPro(scopes);
    }
  }, {
    key: "isFreePortal",
    value: function isFreePortal() {
      var scopes = this.props.scopes;
      return isCallingFree(scopes);
    }
  }, {
    key: "isCloseToThreshold",
    value: function isCloseToThreshold() {
      var _this$props = this.props,
          minutesAvailable = _this$props.minutesAvailable,
          scopes = _this$props.scopes;
      return isNearWarningLimit(minutesAvailable, scopes);
    }
  }, {
    key: "getCallingPartnersURL",
    value: function getCallingPartnersURL() {
      var locale = getLangLocale();
      return locale === 'ja' ? 'https://www.hubspot.jp/integrations/callconnect' : 'https://www.hubspot.com/integrations/calling';
    }
  }, {
    key: "getHeader",
    value: function getHeader() {
      var _this$props2 = this.props,
          selectedCallProvider = _this$props2.selectedCallProvider,
          hasMinutesAvailable = _this$props2.hasMinutesAvailable;
      var isUsingTwilioConnect = getIsProviderTwilioConnect(selectedCallProvider);

      if (isUsingTwilioConnect) {
        return USING_TWILIO + ".header";
      } else if (this.isCloseToThreshold() && hasMinutesAvailable) {
        return USING_HUBSPOT + ".thresholdWarning.header";
      }

      return USING_HUBSPOT + ".outOfMinutes.header";
    }
  }, {
    key: "getText",
    value: function getText() {
      var _this$props3 = this.props,
          selectedCallProvider = _this$props3.selectedCallProvider,
          hasMinutesAvailable = _this$props3.hasMinutesAvailable,
          hasTwilioConnect = _this$props3.hasTwilioConnect;

      if (getIsProviderTwilioConnect(selectedCallProvider)) {
        return USING_TWILIO + ".text";
      }

      var hasTwilioConnectKey = hasTwilioConnect ? 'text' : 'unconnected';

      if (this.isCloseToThreshold() && hasMinutesAvailable) {
        return USING_HUBSPOT + ".thresholdWarning." + hasTwilioConnectKey;
      }

      return USING_HUBSPOT + ".outOfMinutes." + hasTwilioConnectKey;
    }
  }, {
    key: "getCallingPartnerLink",
    value: function getCallingPartnerLink() {
      var locale = getLangLocale();
      var href = locale === 'ja' ? 'https://www.hubspot.jp/integrations/callconnect' : 'https://www.hubspot.com/integrations/calling';
      return /*#__PURE__*/_jsx(UILink, {
        href: href,
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'callingMinutesUsage.callingPartner'
        })
      });
    }
  }, {
    key: "getCallBannerOptions",
    value: function getCallBannerOptions() {
      var _this$props4 = this.props,
          minutesUsed = _this$props4.minutesUsed,
          minutesAvailable = _this$props4.minutesAvailable;
      return {
        callingPartnersLink: this.getCallingPartnerLink(),
        connectLink: this.getConnectLink(),
        settingsLink: this.getSettingsLink(),
        providerSwitchLink: this.getSwitchToTwilioConnectLink(),
        minutesUsed: minutesUsed,
        minutesAvailable: minutesAvailable
      };
    }
  }, {
    key: "getSwitchToTwilioConnectLink",
    value: function getSwitchToTwilioConnectLink() {
      return /*#__PURE__*/_jsx(UILink, {
        onClick: this.handleUpdateCallProvider,
        children: TWILIO
      });
    }
  }, {
    key: "getConnectLink",
    value: function getConnectLink() {
      return /*#__PURE__*/_jsx(UILink, {
        href: "https://knowledge.hubspot.com/calling/hubspot-calling-minutes",
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'callingMinutesUsage.connectToTwilio'
        })
      });
    }
  }, {
    key: "getSettingsLink",
    value: function getSettingsLink() {
      return /*#__PURE__*/_jsx(UILink, {
        href: callingUserPreferencesUrl(PortalIdParser.get()),
        external: true,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callingMinutesUsage.settingsLink"
        })
      });
    }
  }, {
    key: "renderIneligibleMinutesCount",
    value: function renderIneligibleMinutesCount() {
      var hasMinutesAvailable = this.props.hasMinutesAvailable;
      var headerMessage = this.getHeader();
      var i18nOptions = this.getCallBannerOptions();

      var title = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: headerMessage,
        options: i18nOptions
      });

      var message = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: USING_HUBSPOT + ".ineligable",
        options: i18nOptions
      });

      return /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "minutes_usage_banner",
        source: "communicator window",
        title: title,
        message: message,
        isError: !hasMinutesAvailable,
        backgroundColor: CALYPSO_LIGHT
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          selectedCallProvider = _this$props5.selectedCallProvider,
          hasMinutesAvailable = _this$props5.hasMinutesAvailable,
          totalMinutesPerMonth = _this$props5.totalMinutesPerMonth,
          minutesUsed = _this$props5.minutesUsed,
          isLoadSettingsSucceeded = _this$props5.isLoadSettingsSucceeded,
          hasErrors = _this$props5.hasErrors;
      var isTwilioBasedCallProvider = getIsTwilioBasedCallProvider(selectedCallProvider);

      if (!isLoadSettingsSucceeded || hasErrors || !isTwilioBasedCallProvider) {
        return null;
      }

      if (this.isFreePortal()) {
        return /*#__PURE__*/_jsx(AsyncCallingUsageUpgradeBanner, {
          totalMinutesPerMonth: totalMinutesPerMonth,
          minutesUsed: minutesUsed
        });
      }

      var isUsingTwilioConnect = getIsProviderTwilioConnect(selectedCallProvider);
      var showConnectBanner = this.state.showConnectBanner;
      var isCloseToThreshold = this.isCloseToThreshold();

      if (!this.isEligibleForTwilioConnect()) {
        return isCloseToThreshold ? this.renderIneligibleMinutesCount() : null;
      }

      if (!isUsingTwilioConnect && !isCloseToThreshold || !showConnectBanner) {
        return null;
      }

      var headerMessage = this.getHeader();
      var textMessage = this.getText();
      var isError = !hasMinutesAvailable && !isUsingTwilioConnect;
      var onCloseClick;

      if (isUsingTwilioConnect) {
        onCloseClick = this.handleCloseTwilioConnectBanner;
      }

      var i18nOptions = this.getCallBannerOptions();

      var message = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: textMessage,
        options: i18nOptions
      });

      var title = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: headerMessage,
        options: i18nOptions
      });

      return /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "minutes_usage_banner",
        source: "communicator window",
        title: title,
        message: message,
        onCloseClick: onCloseClick,
        isError: isError,
        backgroundColor: CALYPSO_LIGHT
      });
    }
  }]);

  return MinutesAlertBanner;
}(PureComponent);

MinutesAlertBanner.displayName = 'MinutesAlertBanner';
MinutesAlertBanner.propTypes = {
  selectedCallProvider: RecordPropType('CallingProvider'),
  isLoadSettingsSucceeded: PropTypes.bool.isRequired,
  hasMinutesAvailable: PropTypes.bool.isRequired,
  hasTwilioConnect: PropTypes.bool.isRequired,
  minutesUsed: PropTypes.number.isRequired,
  minutesAvailable: PropTypes.number.isRequired,
  scopes: ImmutablePropTypes.list.isRequired,
  setSelectedProvider: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  totalMinutesPerMonth: PropTypes.number.isRequired
};
export default MinutesAlertBanner;