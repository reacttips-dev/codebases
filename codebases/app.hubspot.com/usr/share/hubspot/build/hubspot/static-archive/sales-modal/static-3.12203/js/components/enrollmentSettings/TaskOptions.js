'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useCallback } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import UIMicroTimeInput from 'UIComponents/input/UIMicroTimeInput';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
import UIToggle from 'UIComponents/input/UIToggle';

var TaskOptions = function TaskOptions(_ref) {
  var taskReminderMinute = _ref.taskReminderMinute,
      individualTaskRemindersEnabled = _ref.individualTaskRemindersEnabled,
      handleTempSettingsUpdate = _ref.handleTempSettingsUpdate,
      readOnly = _ref.readOnly;
  var handleToggleOnChange = useCallback(function (_ref2) {
    var checked = _ref2.target.checked;
    handleTempSettingsUpdate('individualTaskRemindersEnabled', checked);
    UsageTracker.track('sequencesUsage', {
      action: "Toggled individual task reminders " + (checked ? 'on' : 'off'),
      subscreen: 'enroll'
    });
  }, [handleTempSettingsUpdate]);
  var handleTimeInputOnChange = useCallback(function (_ref3) {
    var value = _ref3.target.value;
    return handleTempSettingsUpdate('taskReminderMinute', value);
  }, [handleTempSettingsUpdate]);
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIInlineLabel, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sequenceOptions.enrollmentSettings.tasks.label"
      }),
      children: /*#__PURE__*/_jsx(UIToggle, {
        size: "extra-small",
        checked: individualTaskRemindersEnabled,
        onChange: handleToggleOnChange,
        readOnly: readOnly
      })
    }), individualTaskRemindersEnabled && /*#__PURE__*/_jsx("div", {
      className: "p-top-3",
      children: /*#__PURE__*/_jsx(UIInlineLabel, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "enrollModal.sequenceOptions.enrollmentSettings.tasks.timeInputLabel"
        }),
        children: /*#__PURE__*/_jsx(UIMicroTimeInput, {
          interval: 1,
          value: taskReminderMinute,
          onChange: handleTimeInputOnChange,
          readOnly: readOnly
        })
      })
    })]
  });
};

TaskOptions.propTypes = {
  taskReminderMinute: PropTypes.number.isRequired,
  individualTaskRemindersEnabled: PropTypes.bool.isRequired,
  handleTempSettingsUpdate: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired
};
export default TaskOptions;