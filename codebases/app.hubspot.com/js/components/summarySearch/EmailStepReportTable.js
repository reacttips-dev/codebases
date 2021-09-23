'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UITable from 'UIComponents/table/UITable';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import TableHeader from './EmailStepReportTableHeader';
import EmailStepReportTableRow from './EmailStepReportTableRow';

var EmailStepReportTable = function EmailStepReportTable(_ref) {
  var sequenceAnalytics = _ref.sequenceAnalytics;
  var steps = sequenceAnalytics.getIn(['report', 'steps']);

  if (!steps || steps.isEmpty()) {
    return null;
  }

  return /*#__PURE__*/_jsx(UICardWrapper, {
    "data-test-id": "sequence-summary-email-report-table",
    children: /*#__PURE__*/_jsxs(UITable, {
      condensed: true,
      children: [/*#__PURE__*/_jsx("thead", {
        children: /*#__PURE__*/_jsxs("tr", {
          children: [/*#__PURE__*/_jsx(TableHeader, {
            name: "email",
            tooltipMessage: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "summary.sequenceSummarySearchAnalytics.email.help"
            })
          }), /*#__PURE__*/_jsx(TableHeader, {
            className: "text-right",
            name: "totalEnrolled"
          }), /*#__PURE__*/_jsx(TableHeader, {
            className: "text-right",
            name: "opensPerEnroll"
          }), /*#__PURE__*/_jsx(TableHeader, {
            className: "text-right",
            name: "clicksPerEnroll"
          }), /*#__PURE__*/_jsx(TableHeader, {
            className: "text-right",
            name: "repliesPerEnroll"
          }), /*#__PURE__*/_jsx(TableHeader, {
            className: "text-right",
            name: "meetingsBookedPerEnroll"
          })]
        })
      }), /*#__PURE__*/_jsx("tbody", {
        children: steps.map(function (step) {
          return /*#__PURE__*/_jsx(EmailStepReportTableRow, {
            step: step,
            stepNumber: step.stepOrder + 1
          }, step.stepOrder);
        })
      })]
    })
  });
};

EmailStepReportTable.propTypes = {
  sequenceAnalytics: PropTypes.instanceOf(ImmutableMap).isRequired
};
export default EmailStepReportTable;