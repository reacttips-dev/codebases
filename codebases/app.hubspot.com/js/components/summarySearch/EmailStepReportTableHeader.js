'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';

var EmailStepReportTableHeader = function EmailStepReportTableHeader(_ref) {
  var name = _ref.name,
      className = _ref.className,
      tooltipMessage = _ref.tooltipMessage;
  return /*#__PURE__*/_jsxs("th", {
    className: className,
    children: [/*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchAnalytics." + name + ".title"
    }), tooltipMessage && /*#__PURE__*/_jsx(UIHelpIcon, {
      title: tooltipMessage,
      className: "m-left-1"
    })]
  });
};

EmailStepReportTableHeader.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  tooltipMessage: PropTypes.node
};
export default EmailStepReportTableHeader;