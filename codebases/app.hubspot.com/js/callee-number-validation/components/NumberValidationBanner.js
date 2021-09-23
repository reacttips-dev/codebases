'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import PortalIdParser from 'PortalIdParser';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import getLangLocale from 'I18n/utils/getLangLocale';
import UILink from 'UIComponents/link/UILink';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import CallingUpgradeButton from 'calling-settings-ui-library/banners/components/UpgradeButton';
import { createTicket } from 'calling-lifecycle-internal/zorse/zorseControls';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import CallBanner from 'calling-settings-ui-library/banners/components/CallBanner';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
var callingSettingsURL = "/settings/" + PortalIdParser.get() + "/user-preferences/calling";
var errorCodesToBannerName = {
  numberInvalid: 'Pre call - Invalid number',
  numberGeographicallyInvalidSalesFree: 'Pre call - sales free geographic restriction',
  geographicallyInvalidNumber: 'Pre call - japan geographic restriction',
  callerIdInvalid: 'Pre call - number blocked by caller ID',
  blacklistedPaid: 'Pre call - blacklisted number',
  blacklisted: 'Pre call - blacklisted number',
  validationFailed: 'Pre call - number validation failed'
};

var NumberValidationBanner = /*#__PURE__*/function (_PureComponent) {
  _inherits(NumberValidationBanner, _PureComponent);

  function NumberValidationBanner(props, context) {
    var _this;

    _classCallCheck(this, NumberValidationBanner);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(NumberValidationBanner).call(this, props, context)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleContactSupport = function () {
      _this.handleTrackLink();

      createTicket();
    };

    _this.handleTrackLink = function (cta) {
      var source = 'communicator window';
      var bannerType = errorCodesToBannerName[_this.props.validationErrorMessage];
      CommunicatorLogger.log('communicator_bannerInteraction', {
        activity: 'call',
        channel: 'outbound call',
        source: source,
        bannerType: bannerType,
        cta: cta
      });
    };

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(NumberValidationBanner, [{
    key: "renderSupportLink",
    value: function renderSupportLink() {
      return /*#__PURE__*/_jsx(UILink, {
        onClick: this.handleContactSupport,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "callingNumberValidation.contactSupport"
        })
      });
    }
  }, {
    key: "renderUpgradeLink",
    value: function renderUpgradeLink() {
      return /*#__PURE__*/_jsx(CallingUpgradeButton, {
        message: "callingNumberValidation.salesProCTA",
        use: "link"
      });
    }
  }, {
    key: "renderLearnMoreLink",
    value: function renderLearnMoreLink() {
      var url = 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-countries-are-supported-by-calling';
      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        onClick: this.handleTrackLink,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "callingNumberValidation.sixtyCountries"
        })
      });
    }
  }, {
    key: "renderCountryLink",
    value: function renderCountryLink() {
      var url = 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-countries-are-supported-by-calling';
      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        onClick: this.handleTrackLink,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "callingNumberValidation.sixtyCountries"
        })
      });
    }
  }, {
    key: "renderCommunityForumLink",
    value: function renderCommunityForumLink() {
      var url = 'https://community.hubspot.com/t5/Sales-Hub-Tools/Unable-to-call-phone-number-that-may-be-fraudulent-PLEASE-READ/m-p/308379';
      return /*#__PURE__*/_jsx(UILink, {
        href: url,
        external: true,
        onClick: this.handleTrackLink,
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "callingNumberValidation.errorCodeLinkText.communityForum"
        })
      });
    }
  }, {
    key: "renderUpgradeButton",
    value: function renderUpgradeButton() {
      return /*#__PURE__*/_jsx("div", {
        className: "p-top-2",
        children: /*#__PURE__*/_jsx(CallingUpgradeButton, {
          message: "callingNumberValidation.upgradeCTA",
          size: "small",
          use: "secondary"
        })
      });
    }
  }, {
    key: "renderLinksForInvalidMessage",
    value: function renderLinksForInvalidMessage() {
      var locale = getLangLocale();
      var supportedCountriesURL = locale === 'ja' ? 'https://knowledge.hubspot.com/jp/articles/kcs_article/calling/what-countries-are-supported-by-calling' : 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-countries-are-supported-by-calling';
      var integrationsURL = locale === 'ja' ? 'https://www.hubspot.jp/integrations/callconnect' : 'https://www.hubspot.com/integrations/calling';
      return /*#__PURE__*/_jsxs("span", {
        children: [/*#__PURE__*/_jsx(UILink, {
          external: true,
          href: integrationsURL,
          onClick: this.partial(this.handleTrackLink, 'callingPartners'),
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "callingNumberValidation.callingPartners"
          })
        }), /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: supportedCountriesURL,
          onClick: this.partial(this.handleTrackLink, 'supportedCountries'),
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "callingNumberValidation.supportedCountries"
          })
        }), /*#__PURE__*/_jsx(UILink, {
          external: true,
          href: callingSettingsURL,
          onClick: this.partial(this.handleTrackLink, 'callingSettings'),
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "callingNumberValidation.callingSettings"
          })
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isUsingTwilioConnect = _this$props.isUsingTwilioConnect,
          validatedToNumber = _this$props.validatedToNumber,
          validationErrorMessage = _this$props.validationErrorMessage,
          selectedFromNumber = _this$props.selectedFromNumber,
          isPaidHub = _this$props.isPaidHub;

      if (!validationErrorMessage) {
        return null;
      }

      var countryCode = validatedToNumber && validatedToNumber.get('countryCode');
      var headerMessage = "callingNumberValidation." + validationErrorMessage + ".callWaitingAlert.header";
      var textMessage = "callingNumberValidation." + validationErrorMessage + ".callWaitingAlert.text";
      var textMessageOptions = {
        salesProLink: this.renderUpgradeLink(),
        learnMoreLink: this.renderLearnMoreLink(),
        country: countryCode && I18n.text("SharedI18nStrings.countryCodes." + countryCode),
        countryLink: this.renderCountryLink(),
        communityForumLink: this.renderCommunityForumLink(),
        supportLink: this.renderSupportLink(),
        invalidErrorLinks: this.renderLinksForInvalidMessage(),
        upgradeButton: this.renderUpgradeButton()
      };

      var message = /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: textMessage,
        options: textMessageOptions
      });

      var title = /*#__PURE__*/_jsx(FormattedMessage, {
        message: headerMessage,
        options: textMessageOptions
      });

      return /*#__PURE__*/_jsx(CallBanner, {
        bannerType: errorCodesToBannerName[validationErrorMessage],
        isError: true,
        isUsingTwilioConnect: isUsingTwilioConnect,
        message: message,
        selectedFromNumber: selectedFromNumber,
        showMinutesUsage: false,
        title: title,
        isPaidHub: isPaidHub
      });
    }
  }]);

  return NumberValidationBanner;
}(PureComponent);

NumberValidationBanner.propTypes = {
  validationErrorMessage: PropTypes.string,
  isUsingTwilioConnect: PropTypes.bool.isRequired,
  validatedToNumber: RecordPropType('ValidatedNumber'),
  selectedFromNumber: RecordPropType('RegisteredFromNumber'),
  isPaidHub: PropTypes.bool.isRequired
};
export { NumberValidationBanner as default };