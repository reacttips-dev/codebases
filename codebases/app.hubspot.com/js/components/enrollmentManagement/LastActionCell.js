'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import { getPropertyValue } from 'SequencesUI/util/summary/CRMSearchUtils.js';
import FormattedMessage from 'I18n/components/FormattedMessage';

var LastActionCell = function LastActionCell(_ref) {
  var propertyValue = _ref.propertyValue,
      sequenceEnrollment = _ref.sequenceEnrollment;

  if (propertyValue === undefined) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "summary.sequenceSummarySearchLastAction.none"
    });
  }

  var keyPrefix = 'summary.sequenceSummarySearchLastAction.';

  if (getPropertyValue(sequenceEnrollment, 'hs_enrollment_action') === SequenceStepTypes.FINISH_ENROLLMENT) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: keyPrefix + "finished"
    });
  }

  if (!getPropertyValue(sequenceEnrollment, 'hs_enrollment_action')) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: keyPrefix + "none"
    });
  }

  var isEmail = getPropertyValue(sequenceEnrollment, 'hs_enrollment_action') === SequenceStepTypes.SEND_TEMPLATE;
  var stepNumber = +(isEmail ? getPropertyValue(sequenceEnrollment, 'hs_last_executed_email_step_order') : getPropertyValue(sequenceEnrollment, 'hs_last_executed_task_step_order')) + 1;
  var key = "" + keyPrefix + (isEmail ? 'email' : 'task');
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: key,
    options: {
      stepNumber: stepNumber
    }
  });
};

LastActionCell.propTypes = {
  propertyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sequenceEnrollment: PropTypes.object.isRequired
};
export default LastActionCell;