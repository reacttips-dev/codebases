'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import I18n from 'I18n';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { connect } from 'react-redux';
import { getIsPrimarySequence, getSelectedSequenceEnrollmentRecord, getRecommendedSendTimes } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { getSelectedContact as getSelectedContactSelector } from 'sales-modal/redux/selectors/EnrollmentStateSelectors';
import { enrollmentSetFirstSendType, enrollmentSetStepDelay, enrollmentSetTimeOfDay } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import * as SequenceStepTypes from 'sales-modal/constants/SequenceStepTypes';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import * as SimpleDate from 'UIComponents/core/SimpleDate';
import { DAY } from 'sales-modal/constants/Milliseconds';
import getAbsoluteTime from 'sales-modal/utils/enrollModal/getAbsoluteTime';
import { SEND_SPECIFIC_TIME } from 'sales-modal/constants/FirstSendTypes';
import { PRIMARY_SEQUENCE_ID } from 'sales-modal/constants/BulkEnrollConstants';
import { diffWeekDays } from 'sales-modal/utils/weekDays';
import UIFlex from 'UIComponents/layout/UIFlex';
import DelaySelector from './DelaySelector';
import SequenceTimePicker from './SequenceTimePicker';
import SequenceStartDatePicker from './SequenceStartDatePicker';
import SequenceStepTimeSelectionError from './SequenceStepTimeSelectionError';
import { EnrollmentStates } from 'sales-modal/constants/EnrollmentStates';
import { EnrollTypes, EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
import getPreviousActionDate from 'sales-modal/utils/enrollModal/getPreviousActionDate';
import { getReadOnlyTimeInfo } from 'sales-modal/utils/enrollModal/SendTimeUtils';
var SequenceStepTimeSelection = createReactClass({
  displayName: "SequenceStepTimeSelection",
  propTypes: {
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    enrollmentSetFirstSendType: PropTypes.func.isRequired,
    enrollmentSetStepDelay: PropTypes.func.isRequired,
    enrollmentSetTimeOfDay: PropTypes.func.isRequired,
    firstSendType: PropTypes.string.isRequired,
    isPrimarySequence: PropTypes.bool.isRequired,
    isFirstEditableStep: PropTypes.bool.isRequired,
    selectedContact: PropTypes.string,
    sendOnWeekdays: PropTypes.bool.isRequired,
    startingStepOrder: PropTypes.number.isRequired,
    step: PropTypes.instanceOf(ImmutableMap).isRequired,
    stepIndex: PropTypes.number.isRequired,
    stepsWithSendTimeErrors: PropTypes.instanceOf(ImmutableMap),
    stepType: PropTypes.oneOf(Object.values(SequenceStepTypes || {})).isRequired,
    recommendedSendTimes: PropTypes.instanceOf(List),
    enrollType: EnrollTypePropType.isRequired
  },
  handleUpdateTime: function handleUpdateTime(_ref) {
    var value = _ref.target.value;
    this.props.enrollmentSetTimeOfDay({
      step: this.props.step,
      timeValue: value,
      stepType: this.props.stepType
    });
  },
  handleUpdateDelay: function handleUpdateDelay(delay, type) {
    var step = this.props.step;
    this.props.enrollmentSetStepDelay({
      step: step,
      delay: delay
    });
    UsageTracker.track('sequencesUsage', {
      action: "Changed step delay " + type,
      subscreen: 'enroll'
    });
  },
  handleFirstSendTypeChange: function handleFirstSendTypeChange(_ref2) {
    var value = _ref2.target.value;

    if (value === SEND_SPECIFIC_TIME) {
      UsageTracker.track('sequencesUsage', {
        action: 'Clicked send at specific time',
        subscreen: 'enroll'
      });
    }

    this.props.enrollmentSetFirstSendType(value);
  },
  handleDatePicker: function handleDatePicker(e) {
    var chosen = e.target.value;
    var _this$props = this.props,
        step = _this$props.step,
        sendOnWeekdays = _this$props.sendOnWeekdays,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        enrollType = _this$props.enrollType;
    var timezone = sequenceEnrollment.timezone;

    if (!chosen) {
      return;
    }

    var year = chosen.year,
        month = chosen.month,
        date = chosen.date;
    var chosenTimeWithTimezone = I18n.moment().tz(timezone).year(year).month(month).date(date).startOf('day');
    var previousActionDate = getPreviousActionDate({
      sequenceEnrollment: sequenceEnrollment,
      enrollType: enrollType
    });
    var previousStepMomentDate = previousActionDate.clone().startOf('day');
    var dayDelay;

    if (sendOnWeekdays) {
      dayDelay = diffWeekDays(previousStepMomentDate, chosenTimeWithTimezone);
    } else {
      dayDelay = chosenTimeWithTimezone.diff(previousStepMomentDate, 'days');
    }

    var dayDelayInMs = dayDelay * DAY;
    this.props.enrollmentSetStepDelay({
      step: step,
      delay: dayDelayInMs
    });
  },
  getFirstStepDate: function getFirstStepDate() {
    var _this$props2 = this.props,
        sequenceEnrollment = _this$props2.sequenceEnrollment,
        stepIndex = _this$props2.stepIndex,
        step = _this$props2.step,
        enrollType = _this$props2.enrollType;

    if (enrollType === EnrollTypes.VIEW) {
      var _getReadOnlyTimeInfo = getReadOnlyTimeInfo({
        stepIndex: stepIndex,
        sequenceEnrollment: sequenceEnrollment
      }),
          stepMomentScheduled = _getReadOnlyTimeInfo.stepMomentScheduled;

      return SimpleDate.fromMoment(stepMomentScheduled);
    }

    var _getAbsoluteTime = getAbsoluteTime(sequenceEnrollment, step.get('stepOrder')),
        stepMoment = _getAbsoluteTime.stepMoment;

    return SimpleDate.fromMoment(stepMoment);
  },
  getStepHasError: function getStepHasError() {
    var _this$props3 = this.props,
        stepsWithSendTimeErrors = _this$props3.stepsWithSendTimeErrors,
        stepIndex = _this$props3.stepIndex;
    return !!stepsWithSendTimeErrors.get(stepIndex);
  },
  hasSelectedPrimarySequence: function hasSelectedPrimarySequence() {
    return this.props.selectedContact === PRIMARY_SEQUENCE_ID;
  },
  allowEditTimeSelection: function allowEditTimeSelection() {
    return this.props.enrollType !== EnrollTypes.BULK_ENROLL;
  },
  allowEditDateSelection: function allowEditDateSelection() {
    return this.props.enrollType !== EnrollTypes.BULK_ENROLL || this.hasSelectedPrimarySequence();
  },
  renderDateSelection: function renderDateSelection() {
    var _this$props4 = this.props,
        step = _this$props4.step,
        _this$props4$sequence = _this$props4.sequenceEnrollment,
        stepEnrollments = _this$props4$sequence.stepEnrollments,
        timezone = _this$props4$sequence.timezone,
        startingStepOrder = _this$props4.startingStepOrder,
        stepType = _this$props4.stepType,
        firstSendType = _this$props4.firstSendType,
        sendOnWeekdays = _this$props4.sendOnWeekdays,
        isFirstEditableStep = _this$props4.isFirstEditableStep,
        sequenceEnrollment = _this$props4.sequenceEnrollment,
        isPrimarySequence = _this$props4.isPrimarySequence,
        enrollType = _this$props4.enrollType; // When editing a paused sequence, the first step is a delay, not a start date.

    if (isFirstEditableStep && !(sequenceEnrollment.get('enrollmentState') === EnrollmentStates.PAUSED && (enrollType === EnrollTypes.EDIT || enrollType === EnrollTypes.VIEW))) {
      return /*#__PURE__*/_jsx(SequenceStartDatePicker, {
        stepEnrollments: stepEnrollments,
        enrollType: enrollType,
        firstSendType: firstSendType,
        firstStepDate: this.getFirstStepDate(),
        fromEmail: sequenceEnrollment.inboxAddress,
        handleDatePicker: this.handleDatePicker,
        handleFirstSendTypeChange: this.handleFirstSendTypeChange,
        handleUpdateTime: this.handleUpdateTime,
        hasError: this.getStepHasError(),
        readOnly: !this.allowEditDateSelection(),
        sendOnWeekdays: sendOnWeekdays,
        startingStepOrder: startingStepOrder,
        stepIndex: step.get('stepOrder'),
        stepType: stepType,
        timeOfDay: step.get('timeOfDay'),
        timezone: timezone
      });
    }

    return /*#__PURE__*/_jsx(DelaySelector, {
      delay: step.get('delay'),
      handleUpdateDelay: this.handleUpdateDelay,
      hasError: this.getStepHasError(),
      isPrimarySequence: isPrimarySequence,
      enrollType: enrollType,
      readOnly: !this.allowEditDateSelection(),
      sendOnWeekdays: sendOnWeekdays,
      stepType: stepType
    });
  },
  renderTimeSelection: function renderTimeSelection() {
    var _this$props5 = this.props,
        step = _this$props5.step,
        isFirstEditableStep = _this$props5.isFirstEditableStep,
        sequenceEnrollment = _this$props5.sequenceEnrollment,
        stepType = _this$props5.stepType,
        enrollType = _this$props5.enrollType,
        isPrimarySequence = _this$props5.isPrimarySequence,
        recommendedSendTimes = _this$props5.recommendedSendTimes;

    if (isFirstEditableStep && !(sequenceEnrollment.get('enrollmentState') === EnrollmentStates.PAUSED && enrollType === EnrollTypes.EDIT) || step.get('delay') === 0 || stepType === SequenceStepTypes.SCHEDULE_TASK) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIFlex, {
      justify: "end",
      children: /*#__PURE__*/_jsx(SequenceTimePicker, {
        allowEdit: this.allowEditTimeSelection(),
        sequenceEnrollment: sequenceEnrollment,
        enrollType: enrollType,
        isPrimarySequence: isPrimarySequence,
        onChange: this.handleUpdateTime,
        step: step,
        recommendedSendTimes: recommendedSendTimes
      })
    });
  },
  renderSendTimeError: function renderSendTimeError() {
    return /*#__PURE__*/_jsx(SequenceStepTimeSelectionError, {
      selectedContact: this.props.selectedContact,
      stepIndex: this.props.stepIndex,
      stepsWithSendTimeErrors: this.props.stepsWithSendTimeErrors,
      timezone: this.props.sequenceEnrollment.timezone
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [/*#__PURE__*/_jsx(UIFlex, {
          children: this.renderDateSelection()
        }), this.renderTimeSelection()]
      }), this.renderSendTimeError()]
    });
  }
});
export default connect(function (state) {
  return {
    enrollType: state.enrollType,
    sequenceEnrollment: getSelectedSequenceEnrollmentRecord(state),
    isPrimarySequence: getIsPrimarySequence(state),
    selectedContact: getSelectedContactSelector(state),
    recommendedSendTimes: getRecommendedSendTimes(state)
  };
}, {
  enrollmentSetFirstSendType: enrollmentSetFirstSendType,
  enrollmentSetStepDelay: enrollmentSetStepDelay,
  enrollmentSetTimeOfDay: enrollmentSetTimeOfDay
})(SequenceStepTimeSelection);