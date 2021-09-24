'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FollowUpEmailsTimeRangeOption from './FollowUpEmailsTimeRangeOption';
import EligibleFollowUpDaysOption from './EligibleFollowUpDaysOption';
import TaskOptions from './TaskOptions';
import EmailThreadingOption from './EmailThreadingOption';
import UISection from 'UIComponents/section/UISection';
import H5 from 'UIComponents/elements/headings/H5';
import { EnrollTypePropType, EnrollTypes } from 'sales-modal/constants/EnrollTypes';

var EnrollmentSettingsPopoverBody = function EnrollmentSettingsPopoverBody(_ref) {
  var stepEnrollments = _ref.sequenceEnrollment.stepEnrollments,
      enrollType = _ref.enrollType,
      sendWindowStartsAtMin = _ref.sendWindowStartsAtMin,
      sendWindowEndsAtMin = _ref.sendWindowEndsAtMin,
      eligibleFollowUpDays = _ref.eligibleFollowUpDays,
      useThreadedFollowUps = _ref.useThreadedFollowUps,
      taskReminderMinute = _ref.taskReminderMinute,
      individualTaskRemindersEnabled = _ref.individualTaskRemindersEnabled,
      handleTempSettingsUpdate = _ref.handleTempSettingsUpdate;
  var readOnly = enrollType === EnrollTypes.VIEW;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsxs(UISection, {
      children: [/*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.enrollmentSettings.headers.general"
        })
      }), /*#__PURE__*/_jsx(EligibleFollowUpDaysOption, {
        eligibleFollowUpDays: eligibleFollowUpDays,
        handleTempSettingsUpdate: handleTempSettingsUpdate,
        stepEnrollments: stepEnrollments,
        readOnly: readOnly
      })]
    }), /*#__PURE__*/_jsxs(UISection, {
      children: [/*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.enrollmentSettings.headers.followUpEmails"
        })
      }), /*#__PURE__*/_jsx(EmailThreadingOption, {
        stepEnrollments: stepEnrollments,
        useThreadedFollowUps: useThreadedFollowUps,
        handleTempSettingsUpdate: handleTempSettingsUpdate,
        readOnly: readOnly
      }), /*#__PURE__*/_jsx(FollowUpEmailsTimeRangeOption, {
        enrollType: enrollType,
        sendWindowStartsAtMin: sendWindowStartsAtMin,
        sendWindowEndsAtMin: sendWindowEndsAtMin,
        handleTempSettingsUpdate: handleTempSettingsUpdate,
        readOnly: readOnly
      })]
    }), /*#__PURE__*/_jsxs(UISection, {
      className: "m-bottom-0",
      children: [/*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.enrollmentSettings.headers.tasks"
        })
      }), /*#__PURE__*/_jsx(TaskOptions, {
        taskReminderMinute: taskReminderMinute,
        individualTaskRemindersEnabled: individualTaskRemindersEnabled,
        handleTempSettingsUpdate: handleTempSettingsUpdate,
        readOnly: readOnly
      })]
    })]
  });
};

EnrollmentSettingsPopoverBody.propTypes = {
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  enrollType: EnrollTypePropType.isRequired,
  sendWindowStartsAtMin: PropTypes.number.isRequired,
  sendWindowEndsAtMin: PropTypes.number.isRequired,
  eligibleFollowUpDays: PropTypes.string.isRequired,
  useThreadedFollowUps: PropTypes.bool.isRequired,
  taskReminderMinute: PropTypes.number.isRequired,
  individualTaskRemindersEnabled: PropTypes.bool.isRequired,
  handleTempSettingsUpdate: PropTypes.func.isRequired
};
export default EnrollmentSettingsPopoverBody;