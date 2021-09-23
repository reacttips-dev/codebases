'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import PortalIdParser from 'PortalIdParser';
import UIAlert from 'UIComponents/alert/UIAlert';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import { callingUserPreferencesUrl } from 'calling-settings-ui-library/utils/urlUtils';

function CallingUsageBaseMessage(_ref) {
  var totalMinutesPerMonth = _ref.totalMinutesPerMonth,
      minutesUsed = _ref.minutesUsed;
  return /*#__PURE__*/_jsx(UIAlert, {
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "callingMinutesUsage.usingHubspot.defaultMessage",
      options: {
        totalMinutesPerMonth: totalMinutesPerMonth,
        minutesUsed: minutesUsed
      }
    }),
    type: "info",
    children: /*#__PURE__*/_jsx(UILink, {
      external: true,
      href: callingUserPreferencesUrl(PortalIdParser.get()),
      "data-selenium-test": "calling-widget-see-monthly-usage-button",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callingMinutesUsage.minutesUsageCTA"
      })
    })
  });
}

CallingUsageBaseMessage.propTypes = {
  totalMinutesPerMonth: PropTypes.number.isRequired,
  minutesUsed: PropTypes.number.isRequired
};
export default /*#__PURE__*/memo(CallingUsageBaseMessage);