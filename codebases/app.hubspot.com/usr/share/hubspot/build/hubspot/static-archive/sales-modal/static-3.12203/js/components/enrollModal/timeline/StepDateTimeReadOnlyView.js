'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
import { isAttemptedOrFinishedStep, getReadOnlyTimeInfo } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import { getDateAndTime } from 'sales-modal/utils/enrollModal/getDateAndTime';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SequenceStepCompletionTime from 'sales-modal/components/enrollModal/timeSelection/SequenceStepCompletionTime';
import StepTimeReadOnlyViewTooltip from '../timeSelection/StepTimeReadOnlyViewTooltip';

var StepDateTimeReadOnlyView = function StepDateTimeReadOnlyView(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      stepIndex = _ref.stepIndex;
  var enrollmentState = sequenceEnrollment.enrollmentState,
      startingStepOrder = sequenceEnrollment.startingStepOrder,
      stepEnrollments = sequenceEnrollment.stepEnrollments,
      timezone = sequenceEnrollment.timezone;
  var completedStep = isAttemptedOrFinishedStep(stepIndex, stepEnrollments);

  if (completedStep) {
    return /*#__PURE__*/_jsx(SequenceStepCompletionTime, {
      completedStep: completedStep,
      timezone: timezone,
      showReadOnlyTooltip: true,
      readOnlyTooltipProps: {
        stepIndex: stepIndex,
        sequenceEnrollment: sequenceEnrollment
      }
    });
  } else if (stepIndex < startingStepOrder) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceTimeline.skipped"
    });
  } else if (enrollmentState === EnrollmentStates.UNENROLLED) {
    return 'Not scheduled';
  }

  var _getReadOnlyTimeInfo = getReadOnlyTimeInfo({
    stepIndex: stepIndex,
    sequenceEnrollment: sequenceEnrollment
  }),
      stepMomentScheduled = _getReadOnlyTimeInfo.stepMomentScheduled;

  var _getDateAndTime = getDateAndTime(stepMomentScheduled),
      date = _getDateAndTime.date,
      time = _getDateAndTime.time;

  return /*#__PURE__*/_jsx(StepTimeReadOnlyViewTooltip, {
    stepIndex: stepIndex,
    sequenceEnrollment: sequenceEnrollment,
    children: /*#__PURE__*/_jsxs("span", {
      children: [date, " at ", time]
    })
  });
};

StepDateTimeReadOnlyView.propTypes = {
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  stepIndex: PropTypes.number.isRequired
};
export default StepDateTimeReadOnlyView;