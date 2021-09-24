'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import StepReportRecord from 'SequencesUI/records/StepReportRecord';
import getPercentage from 'SequencesUI/util/getPercentage';
import { SCHEDULE_TASK } from 'SequencesUI/constants/SequenceStepTypes';
import FormattedPercentage from 'I18n/components/FormattedPercentage';

var EmailStepReportTableRow = function EmailStepReportTableRow(_ref) {
  var step = _ref.step,
      stepNumber = _ref.stepNumber;

  var _step$toObject = step.toObject(),
      sends = _step$toObject.sends,
      opensPerSend = _step$toObject.opensPerSend,
      clicksPerSend = _step$toObject.clicksPerSend,
      repliesPerSend = _step$toObject.repliesPerSend,
      meetingsBookedPerSend = _step$toObject.meetingsBookedPerSend;

  var renderEmailDetails = function renderEmailDetails() {
    var stepTypeKey = step.get('action') === SCHEDULE_TASK ? 'manualEmailStep' : 'emailStep';
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchAnalytics." + stepTypeKey,
      options: {
        stepNumber: stepNumber
      }
    });
  };

  return /*#__PURE__*/_jsxs("tr", {
    children: [/*#__PURE__*/_jsx("td", {
      children: renderEmailDetails()
    }), /*#__PURE__*/_jsx("td", {
      className: "text-right",
      children: sends
    }), /*#__PURE__*/_jsx("td", {
      className: "text-right",
      children: /*#__PURE__*/_jsx(FormattedPercentage, {
        value: getPercentage(opensPerSend)
      })
    }), /*#__PURE__*/_jsx("td", {
      className: "text-right",
      children: /*#__PURE__*/_jsx(FormattedPercentage, {
        value: getPercentage(clicksPerSend)
      })
    }), /*#__PURE__*/_jsx("td", {
      className: "text-right",
      children: /*#__PURE__*/_jsx(FormattedPercentage, {
        value: getPercentage(repliesPerSend)
      })
    }), /*#__PURE__*/_jsx("td", {
      className: "text-right",
      children: /*#__PURE__*/_jsx(FormattedPercentage, {
        value: getPercentage(meetingsBookedPerSend)
      })
    })]
  });
};

EmailStepReportTableRow.propTypes = {
  step: PropTypes.instanceOf(StepReportRecord).isRequired,
  stepNumber: PropTypes.number.isRequired
};
export default EmailStepReportTableRow;