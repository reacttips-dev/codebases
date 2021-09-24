'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { MARIGOLD_LIGHT } from 'HubStyleTokens/colors';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import I18n from 'I18n';
import { callingUserPreferencesUrl } from 'calling-settings-ui-library/utils/urlUtils';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import { RESTRICTED_COUNTRY_CODES } from 'calling-settings-ui-library/constants/restrictedCountryCodes';
import { getIsProviderTwilioConnect } from 'calling-lifecycle-internal/call-provider/operators/getIsProviderTwilioConnect';
import { COUNTRY_UNSUPPORTED_WARNING_CLOSED } from '../../userSettings/constants/UserSettingsKeys';

var CountryUnsupportedWarningBanner = /*#__PURE__*/function (_PureComponent) {
  _inherits(CountryUnsupportedWarningBanner, _PureComponent);

  function CountryUnsupportedWarningBanner() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, CountryUnsupportedWarningBanner);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(CountryUnsupportedWarningBanner)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      isOpen: true
    };

    _this.onCloseClick = function () {
      var saveUserSetting = _this.props.saveUserSetting;
      saveUserSetting({
        key: COUNTRY_UNSUPPORTED_WARNING_CLOSED,
        value: true
      });

      _this.setState({
        isOpen: false
      });
    };

    return _this;
  }

  _createClass(CountryUnsupportedWarningBanner, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isUngatedForCountryUnsupportedMessaging = _this$props.isUngatedForCountryUnsupportedMessaging,
          selectedFromNumber = _this$props.selectedFromNumber,
          selectedCallProvider = _this$props.selectedCallProvider,
          showCountryUnsupportedWarning = _this$props.showCountryUnsupportedWarning;
      var countryCode = selectedFromNumber && selectedFromNumber.get('countryCode');

      if (!isUngatedForCountryUnsupportedMessaging || getIsProviderTwilioConnect(selectedCallProvider) || !RESTRICTED_COUNTRY_CODES.includes(countryCode)) {
        return null;
      }

      var options = {
        country: countryCode && I18n.text("SharedI18nStrings.countryCodes." + countryCode),
        learnMoreLink: {
          external: true,
          href: 'https://knowledge.hubspot.com/calling/what-countries-are-supported-by-calling'
        },
        setupProviderLink: {
          external: true,
          href: callingUserPreferencesUrl(PortalIdParser.get())
        }
      };

      var message = /*#__PURE__*/_jsx(FormattedJSXMessage, {
        message: 'calling-communicator-ui.countryUnsupportedWarning.message_jsx',
        options: options,
        elements: {
          UILink: UILink
        }
      });

      var title = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "calling-communicator-ui.countryUnsupportedWarning.titles." + countryCode
      });

      var showBanner = showCountryUnsupportedWarning && this.state.isOpen;
      return showBanner ? /*#__PURE__*/_jsx(CallBanner, {
        bannerType: "Device Warning",
        message: message,
        title: title,
        isError: false,
        backgroundColor: MARIGOLD_LIGHT,
        onCloseClick: this.onCloseClick
      }) : null;
    }
  }]);

  return CountryUnsupportedWarningBanner;
}(PureComponent);

CountryUnsupportedWarningBanner.propTypes = {
  isUngatedForCountryUnsupportedMessaging: PropTypes.bool.isRequired,
  selectedFromNumber: RecordPropType('RegisteredFromNumber').isRequired,
  selectedCallProvider: RecordPropType('CallingProvider').isRequired,
  showCountryUnsupportedWarning: PropTypes.bool.isRequired,
  saveUserSetting: PropTypes.func.isRequired
};
export default CountryUnsupportedWarningBanner;