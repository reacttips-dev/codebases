'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIPricingPageRedirectButton from 'ui-addon-upgrades/button/UIPricingPageRedirectButton';

function PricingPageButton(_ref) {
  var upgradeData = _ref.upgradeData;
  return /*#__PURE__*/_jsx(UIPricingPageRedirectButton, {
    upgradeData: upgradeData,
    size: "xs",
    className: "m-x-2",
    use: "primary-white",
    responsive: false,
    "data-test-id": "pricing-page-redirect-button",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "trial-banner-ui.upgrade"
    })
  });
}

PricingPageButton.propTypes = {
  upgradeData: PropTypes.object
};
export default PricingPageButton;