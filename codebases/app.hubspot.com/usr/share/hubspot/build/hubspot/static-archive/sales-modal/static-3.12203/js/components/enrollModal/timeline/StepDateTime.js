'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import memoize from 'transmute/memoize';
import { SEND_IMMEDIATELY } from 'sales-modal/constants/FirstSendTypes';
import { SCHEDULE_TASK, SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import { isAttemptedOrFinishedStep } from 'sales-modal/utils/enrollModal/SendTimeUtils';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import UILink from 'UIComponents/link/UILink';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import SequenceStepCompletionTime from 'sales-modal/components/enrollModal/timeSelection/SequenceStepCompletionTime';
import { sendLimitLearnMore } from 'sales-modal/lib/links';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import { getDateAndTime } from 'sales-modal/utils/enrollModal/getDateAndTime';
import SequenceEnrollmentRecord from '../../../data/SequenceEnrollmentRecord';
var getMomentWithTimezone = memoize(function (stepMoment, timezone) {
  return timezone ? stepMoment.tz(timezone) : stepMoment;
});

var StepDateTime = function StepDateTime(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      stepIndex = _ref.stepIndex,
      enrollmentPaused = _ref.enrollmentPaused,
      firstPausingStepIndex = _ref.firstPausingStepIndex,
      firstSendType = _ref.firstSendType;
  var stepEnrollments = sequenceEnrollment.stepEnrollments;
  var startingStepOrder = sequenceEnrollment.get('startingStepOrder');
  var completedStep = isAttemptedOrFinishedStep(stepIndex, stepEnrollments);

  if (completedStep) {
    return /*#__PURE__*/_jsx(SequenceStepCompletionTime, {
      completedStep: completedStep,
      timezone: sequenceEnrollment.timezone
    });
  } else if (stepIndex < startingStepOrder) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "enrollModal.sequenceTimeline.skipped"
    });
  } else if (enrollmentPaused) {
    return /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceTimeline.paused.tooltip"
      }),
      placement: "right",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "enrollModal.sequenceTimeline.paused.label"
      })
    });
  }

  var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, stepIndex),
      stepMoment = _getAbsoluteTime.stepMoment;

  stepMoment = getMomentWithTimezone(stepMoment, sequenceEnrollment.get('timezone'));
  var dateAndTime = getDateAndTime(stepMoment);
  var action = sequenceEnrollment.getIn(['steps', stepIndex, 'action']);

  if (stepIndex === startingStepOrder) {
    switch (action) {
      case SCHEDULE_TASK:
        if (firstSendType === SEND_IMMEDIATELY) {
          return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "enrollModal.sequenceTimeline.createImmediatelyV2",
            options: dateAndTime
          });
        }

        break;

      case SEND_TEMPLATE:
        {
          var sendDateMessage = firstSendType === SEND_IMMEDIATELY ? 'enrollModal.sequenceTimeline.sendNow' : 'enrollModal.sequenceTimeline.estimated.sendDate';
          return /*#__PURE__*/_jsx(UITooltip, {
            title: /*#__PURE__*/_jsx(FormattedJSXMessage, {
              message: "enrollModal.sendTimes.firstSendTime.autoEmailTooltipSingle_jsx",
              options: {
                href: sendLimitLearnMore(),
                external: true
              },
              elements: {
                Link: UILink
              }
            }),
            placement: "right",
            children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: sendDateMessage,
              options: dateAndTime
            })
          });
        }

      default:
        break;
    }
  }

  if (stepIndex > firstPausingStepIndex) {
    var message = action === SCHEDULE_TASK ? 'enrollModal.sequenceTimeline.estimated.createDate' : 'enrollModal.sequenceTimeline.estimated.sendDate';
    return /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceTimeline.estimated.tooltip"
      }),
      placement: "right",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: message,
        options: dateAndTime
      })
    });
  }

  var onlyShowDate = action === SCHEDULE_TASK;
  return onlyShowDate ? dateAndTime.date : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "enrollModal.sequenceTimeline.sendDate",
    options: dateAndTime
  });
};

StepDateTime.propTypes = {
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  stepIndex: PropTypes.number.isRequired,
  enrollmentPaused: PropTypes.bool.isRequired,
  firstPausingStepIndex: PropTypes.number,
  firstSendType: PropTypes.string.isRequired
};
export default StepDateTime;