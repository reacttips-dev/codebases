'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import { fromJS } from 'immutable';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import { applySendOptions } from 'sales-modal/redux/actions/EnrollmentEditorActions';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import EnrollmentSettingsPopoverBody from './EnrollmentSettingsPopoverBody';
import EnrollmentSettingsPopoverFooter from './EnrollmentSettingsPopoverFooter';
import SendTimesButton from './SendTimesButton';
import { EnrollTypePropType } from 'sales-modal/constants/EnrollTypes';
var EnrollmentSettingsPopover = createReactClass({
  displayName: "EnrollmentSettingsPopover",
  propTypes: {
    sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
    enrollType: EnrollTypePropType.isRequired,
    applySendOptions: PropTypes.func.isRequired
  },
  getInitialState: function getInitialState() {
    var _this$props$sequenceE = this.props.sequenceEnrollment.sequenceSettings,
        sendWindowStartsAtMin = _this$props$sequenceE.sendWindowStartsAtMin,
        sendWindowEndsAtMin = _this$props$sequenceE.sendWindowEndsAtMin,
        eligibleFollowUpDays = _this$props$sequenceE.eligibleFollowUpDays,
        useThreadedFollowUps = _this$props$sequenceE.useThreadedFollowUps,
        taskReminderMinute = _this$props$sequenceE.taskReminderMinute,
        individualTaskRemindersEnabled = _this$props$sequenceE.individualTaskRemindersEnabled;
    return {
      open: false,
      tempSettings: {
        sendWindowStartsAtMin: sendWindowStartsAtMin,
        sendWindowEndsAtMin: sendWindowEndsAtMin,
        eligibleFollowUpDays: eligibleFollowUpDays,
        useThreadedFollowUps: useThreadedFollowUps,
        taskReminderMinute: taskReminderMinute,
        individualTaskRemindersEnabled: individualTaskRemindersEnabled
      }
    };
  },
  handleSave: function handleSave() {
    var _this$state$tempSetti = this.state.tempSettings,
        sendWindowStartsAtMin = _this$state$tempSetti.sendWindowStartsAtMin,
        sendWindowEndsAtMin = _this$state$tempSetti.sendWindowEndsAtMin,
        eligibleFollowUpDays = _this$state$tempSetti.eligibleFollowUpDays,
        useThreadedFollowUps = _this$state$tempSetti.useThreadedFollowUps,
        taskReminderMinute = _this$state$tempSetti.taskReminderMinute,
        individualTaskRemindersEnabled = _this$state$tempSetti.individualTaskRemindersEnabled;
    this.props.applySendOptions({
      startOfTimeRange: sendWindowStartsAtMin,
      endOfTimeRange: sendWindowEndsAtMin,
      eligibleFollowUpDays: eligibleFollowUpDays,
      useThreadedFollowUps: useThreadedFollowUps,
      taskReminderMinute: taskReminderMinute,
      individualTaskRemindersEnabled: individualTaskRemindersEnabled
    });
    this.setState({
      open: false
    });
  },
  handleClose: function handleClose() {
    this.setState(this.getInitialState());
  },
  handleTempSettingsUpdate: function handleTempSettingsUpdate(field, value) {
    var tempSettings = Object.assign({}, this.state.tempSettings);
    tempSettings[field] = value;
    this.setState({
      tempSettings: tempSettings
    });
  },
  toggleOpen: function toggleOpen() {
    var open = this.state.open;
    this.setState({
      open: !open
    });

    if (open) {
      this.handleClose();
    }
  },
  getNumberOfEdits: function getNumberOfEdits() {
    var sequenceSettings = this.props.sequenceEnrollment.sequenceSettings;
    var tempSettings = fromJS(this.state.tempSettings);
    return tempSettings.filterNot(function (value, setting) {
      return value === sequenceSettings.get(setting);
    }).size;
  },
  render: function render() {
    var _this = this;

    var _this$props = this.props,
        sequenceEnrollment = _this$props.sequenceEnrollment,
        enrollType = _this$props.enrollType;
    var _this$state$tempSetti2 = this.state.tempSettings,
        sendWindowStartsAtMin = _this$state$tempSetti2.sendWindowStartsAtMin,
        sendWindowEndsAtMin = _this$state$tempSetti2.sendWindowEndsAtMin,
        eligibleFollowUpDays = _this$state$tempSetti2.eligibleFollowUpDays,
        useThreadedFollowUps = _this$state$tempSetti2.useThreadedFollowUps,
        taskReminderMinute = _this$state$tempSetti2.taskReminderMinute,
        individualTaskRemindersEnabled = _this$state$tempSetti2.individualTaskRemindersEnabled;
    return /*#__PURE__*/_jsx(UIPopover, {
      open: this.state.open,
      closeOnOutsideClick: true,
      placement: "bottom left",
      onOpenChange: function onOpenChange(e) {
        var isOpen = e.target.value;

        if (!isOpen) {
          _this.handleClose();
        }
      },
      content: {
        body: /*#__PURE__*/_jsx(EnrollmentSettingsPopoverBody, {
          sequenceEnrollment: sequenceEnrollment,
          enrollType: enrollType,
          sendWindowStartsAtMin: sendWindowStartsAtMin,
          sendWindowEndsAtMin: sendWindowEndsAtMin,
          eligibleFollowUpDays: eligibleFollowUpDays,
          useThreadedFollowUps: useThreadedFollowUps,
          taskReminderMinute: taskReminderMinute,
          individualTaskRemindersEnabled: individualTaskRemindersEnabled,
          handleTempSettingsUpdate: this.handleTempSettingsUpdate
        }),
        footer: /*#__PURE__*/_jsx(EnrollmentSettingsPopoverFooter, {
          numberOfEdits: this.getNumberOfEdits(),
          handleSave: this.handleSave,
          handleClose: this.handleClose
        })
      },
      children: /*#__PURE__*/_jsx(SendTimesButton, {
        toggleOpen: this.toggleOpen
      })
    });
  }
});
export default connect(function (state) {
  return {
    enrollType: state.enrollType
  };
}, {
  applySendOptions: applySendOptions
})(EnrollmentSettingsPopover);