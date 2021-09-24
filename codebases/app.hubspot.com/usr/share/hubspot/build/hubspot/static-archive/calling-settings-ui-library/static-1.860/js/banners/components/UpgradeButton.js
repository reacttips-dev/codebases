'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import UIPricingPageRedirectButton from 'ui-addon-upgrades/button/UIPricingPageRedirectButton';
var displayName = 'CallingUpgradeButton';
var propTypes = {
  message: PropTypes.string,
  options: PropTypes.object,
  use: PropTypes.string,
  size: PropTypes.string
};

var CallingUpgradeButton = function CallingUpgradeButton(_ref) {
  var message = _ref.message,
      options = _ref.options,
      use = _ref.use,
      size = _ref.size;
  var upgradeData = {
    app: 'calling',
    screen: 'contact-record',
    upgradeProduct: 'sales-starter',
    uniqueId: 'geographic-calling-limit'
  };
  return /*#__PURE__*/_jsx(UIPricingPageRedirectButton, {
    upgradeData: upgradeData,
    responsive: false,
    size: size,
    use: use,
    children: /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: message,
      options: options
    })
  });
};

CallingUpgradeButton.displayName = displayName;
CallingUpgradeButton.propTypes = propTypes;
export default CallingUpgradeButton;