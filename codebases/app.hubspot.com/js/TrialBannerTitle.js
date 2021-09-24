'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDaysRemaining } from './useDaysRemaining';
var StyledFormattedReactMessage = styled(FormattedReactMessage).withConfig({
  displayName: "TrialBannerTitle__StyledFormattedReactMessage",
  componentId: "sc-1rlmcwm-0"
})(["font-size:16px;font-weight:600;"]);
var StyledFormattedMessage = styled(FormattedMessage).withConfig({
  displayName: "TrialBannerTitle__StyledFormattedMessage",
  componentId: "sc-1rlmcwm-1"
})(["font-weight:600;"]);

var TrialBannerTitle = function TrialBannerTitle(_ref) {
  var message = _ref.message,
      preferredTrialUpgradeProduct = _ref.preferredTrialUpgradeProduct;
  var daysRemaining = useDaysRemaining({
    preferredTrialUpgradeProduct: preferredTrialUpgradeProduct
  });
  var trialName = preferredTrialUpgradeProduct === 'cms' ? 'cms-professional' : preferredTrialUpgradeProduct;
  return /*#__PURE__*/_jsx(StyledFormattedReactMessage, {
    className: "m-right-2",
    message: message,
    options: {
      count: daysRemaining,
      productName: /*#__PURE__*/_jsx(StyledFormattedMessage, {
        message: "trial-banner-ui." + trialName
      })
    }
  });
};

TrialBannerTitle.propTypes = {
  message: PropTypes.string,
  preferredTrialUpgradeProduct: PropTypes.string.isRequired
};
export default TrialBannerTitle;